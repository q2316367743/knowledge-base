import './index.less';

import {IconHtml} from '@codexteam/icons';
import {API, BlockTool, BlockToolConstructorOptions} from "@editorjs/editorjs";
import {Button, Input, Space, Tooltip} from 'tdesign-vue-next';
import {EditIcon, FullscreenExitIcon, FullscreenIcon} from 'tdesign-icons-vue-next';
import MonacoEditor from "@/editor/MonacoEditor/MonacoEditor.vue";
import {codeRun, disabledCodeRun} from "@/plugin/CodeRun";
import router from '@/plugin/router';
import {makeElement} from "@/utils/lang/DocumentUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {parseFileExtra} from "@/utils/file/FileUtil";

interface CodeData {
  html?: string;
  height?: string;
  filename?: string;
}

interface CodeCss {
  baseClass: string;
  input: string;
  wrapper: string;
}

export default class CodeTool implements BlockTool {

  private readonly readOnly: boolean;
  private api: API;
  private readonly CSS: CodeCss;

  private content: Ref<string>;
  private height: Ref<string>;
  private filename: Ref<string>;
  public fs: Ref<boolean> = ref(false);

  private wrapper?: HTMLDivElement;

  /**
   * Notify core that read-only mode is supported
   */
  public static readonly isReadOnlySupported = true;
  public static readonly isLineBreaksEnabled = true;
  /**
   * 自动消毒配置
   */
  public static readonly sanitize = {
    html: true, // Allow HTML tags
  };

  /**
   * Get Tool toolbox settings
   */
  static get toolbox() {
    return {
      icon: IconHtml,
      title: '代码块',
    };
  }


  constructor(p: BlockToolConstructorOptions<CodeData>) {
    const {data, api, readOnly} = p;
    this.api = api;
    this.readOnly = readOnly;

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-rawtool',
    };

    this.content = ref(data.html || '');
    this.height = ref(data.height || '200');
    this.filename = ref(data.filename || '');

  }

  /**
   * Return Tool's view
   *
   * @public
   */
  render(): HTMLDivElement {
    if (!this.wrapper) {
      this.wrapper = makeElement('div', ['ce-code']);
      this.wrapper.addEventListener('keydown', (e: KeyboardEvent) => {
        // 如果是enter键
        if (e.key === 'Enter') {
          e.stopPropagation();
        }
      });
    }
    this.wrapper.style.position = 'relative';

    const {readOnly, filename, content, height, fs} = this;

    watch(fs, val => {
      if (val) {
        this.wrapper?.classList.add('ce-code-fullscreen-active');
      } else {
        this.wrapper?.classList.remove('ce-code-fullscreen-active');
      }
    })

    const app = createApp({
      setup() {
        let startY = 0;
        let startHeight = 0;

        const edit = ref(false);

        const disabled = computed(() => disabledCodeRun(filename.value));
        const language = computed(() => parseFileExtra(filename.value));

        const onMouseDown = (e: MouseEvent) => {
          startY = e.clientY;
          startHeight = parseInt(height.value);
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          e.preventDefault();
        };

        const onMouseMove = (e: MouseEvent) => {
          const newHeight = startHeight + e.clientY - startY;
          // 限制高度在200px到800px之间
          const clampedHeight = Math.max(200, Math.min(800, newHeight));
          height.value = `${clampedHeight}px`;
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        const onBlur = () => edit.value = false;

        function onRun() {
          if (disabled.value) {
            NotificationUtil.alert('请先配置运行命令', "代码运行", {
              confirmButtonText: '立即前往'
            }).then(() => {
              router.push("/setting/code-run")
            });
            return;
          }
          codeRun(filename.value, content.value).then(() => {
            MessageUtil.info("运行成功")
          }).catch((e) => {
            MessageUtil.error(e)
          })

        }

        return () => (
          <>
            <div class="ce-code-header flex justify-between p-8px items-center">
              <div class={'flex items-center'}>
                {edit.value ?
                  <Input v-model={filename.value} class={'w-full'} placeholder={'请输入文件名'} autofocus size={'small'}
                         onBlur={onBlur} onEnter={onBlur}></Input> :
                  <div class={{
                    'ce-code-filename': true,
                    'empty': isEmptyString(filename.value),
                    'ellipsis': true
                  }} style={{maxWidth: '500px'}}>{filename.value || '请输入文件名'}</div>}
                {!readOnly && <Button theme={'primary'} size={'small'} variant={'text'} shape={'square'}
                                      class={'ml-2'}
                                      onClick={() => edit.value = !edit.value}>{{
                  icon: () => <EditIcon/>
                }}</Button>}
              </div>
              <Space size={'small'}>
                <Button theme={'primary'} variant={'text'} shape={'square'} size={'small'}
                        onClick={() => fs.value = !fs.value}>{{
                  icon: () => fs.value ? <FullscreenExitIcon/> : <FullscreenIcon/>
                }}</Button>
                <Tooltip content={disabled.value ? '请先配置运行命令' : '代码运行'}>
                  <Button theme={'primary'} size={'small'} onClick={onRun}>运行</Button>
                </Tooltip>
              </Space>
            </div>
            <div style={{height: fs.value ? 'calc(100% - 41px)' : height.value}}>
              <MonacoEditor v-model={content.value} readOnly={readOnly} language={language.value}/>
              {!readOnly && <div class="ce-code-resize-handle" onMousedown={onMouseDown}>···</div>}
            </div>
          </>
        );
      }
    });

    app.mount(this.wrapper);

    return this.wrapper;
  }

  /**
   * Extract Tool's data from the view
   *
   * @returns  raw HTML code
   * @public
   */
  save(): CodeData {
    return {
      html: this.content.value,
      height: this.height.value,
      filename: this.filename.value,
    };
  }

}