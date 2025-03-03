import './index.less';

import {IconHtml} from '@codexteam/icons';
import {API, BlockTool, BlockToolConstructorOptions} from "@editorjs/editorjs";
import {makeElement} from "@/utils/lang/DocumentUtil";
import MonacoEditor from "@/editor/MonacoEditor/MonacoEditor.vue";

interface CodeData {
  html?: string;
  height?: string;
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
  private wrapper?: HTMLDivElement;

  /**
   * Notify core that read-only mode is supported
   */
  public static readonly isReadOnlySupported = true
  /**
   * Should this tool be displayed at the Editor's Toolbox
   */
  public static readonly displayInToolbox = true;
  /**
   * Allow to press Enter inside the RawTool textarea
   */
  public static readonly enableLineBreaks = true;
  /**
   * Default placeholder for RawTool's textarea
   */
  public static readonly DEFAULT_PLACEHOLDER = '请输入HTML代码';
  /**
   * 自动消毒配置
   */
  public static readonly sanitize =  {
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

  get data() {
    return {
      html: this.content.value,
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
    this.height = ref(data.height || '200px');

  }

  /**
   * Return Tool's view
   *
   * @public
   */
  render(): HTMLDivElement {
    this.wrapper = makeElement('div', [this.CSS.baseClass, this.CSS.input, 'ce-rawtool']);
    this.wrapper.style.position = 'relative';

    const {readOnly, wrapper, content, height} = this;

    const app = createApp({
      setup() {
        let startY = 0;
        let startHeight = 0;

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

        // onMounted(() => {
        //   if (!readOnly) {
        //     const resizeHandle = makeElement('div', ['ce-code-resize-handle']);
        //     resizeHandle.style.cssText = 'width: 100%; height: 5px; cursor: ns-resize; position: absolute; bottom: 0; left: 0; background: transparent;';
        //     resizeHandle.addEventListener('mousedown', onMouseDown);
        //     wrapper?.appendChild(resizeHandle);
        //   }
        // });

        return () => (
          <div style={{height: height.value}}>
            <MonacoEditor v-model={content.value} readOnly={readOnly}/>
            {!readOnly && <div class="ce-code-resize-handle" onMousedown={onMouseDown}></div>}
          </div>
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
    };
  }

}