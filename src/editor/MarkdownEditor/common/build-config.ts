import Cherry from "cherry-markdown";
import {
  CherryOptions,
  CherryToolbarsOptions
} from "cherry-markdown/types/cherry";
import {useGlobalStore} from "@/store/GlobalStore";
import {useScreenShotMenu} from "@/editor/MarkdownEditor/menu/ScreenShotMenu";
import {usePanGu} from "@/editor/MarkdownEditor/menu/PanGuMenu";
import {useFanYi} from "@/editor/MarkdownEditor/menu/FanYiMenu";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useAskAi} from "@/editor/MarkdownEditor/menu/AskAi";
import {RelationArticleSyntaxHook} from "@/editor/MarkdownEditor/syntax/RelationArticle";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import {onClickPreview} from "@/editor/MarkdownEditor/common/event";


export async function buildConfig(
  articleId: number,
  id: string,
  value: string,
  preview: boolean,
  instance: Ref<Cherry | undefined> | null,
  update: ((content: string) => void) | null,
  sendToChat: ((content: string) => void) | null): Promise<Partial<CherryOptions>> {

  const {defaultModel, classicBr, mdEditorKeyMap} = useBaseSettingStore();

  // 默认模式
  const model = preview ?
    'previewOnly' : defaultModel;

  const toolbar: CherryToolbarsOptions['toolbar'] = [];
  const bubble: Array<string> = [];

  toolbar.push(
    'quote',
    'header',
    {
      YangShi: [
        'bold',
        'italic', 'strikethrough', 'underline', 'sub', 'sup', 'ruby'],
    },
    {
      ZiTi: [
        'size',
        'color']
    },
    '|',
    {
      checklist: ['ol', 'ul', 'checklist']
    },
    'panel',
    'justify',
    'detail',
    '|',
    'search',
    'shortcutKey',
    '|',
    {
      insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word', 'ruby'],
    },
    'graph',
    'ScreenShotMenu'
  );
  bubble.push(...['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'ruby', '|', 'PanGu', 'FanYi'])

  let customMenu: Record<string, any> = {};
  if (instance && sendToChat) {

    customMenu = {
      // 菜单
      AI: useAskAi(articleId, sendToChat),
      ScreenShotMenu: useScreenShotMenu(instance),
      PanGu: usePanGu(),
      FanYi: useFanYi(),
      // 分组
      YangShi: Cherry.createMenuHook("样式", {}),
      ZiTi: Cherry.createMenuHook("字体", {}),
      WenAn: Cherry.createMenuHook("文案", {}),
    }
  }

  const {isDark} = useGlobalStore();

  return {
    id: id,
    value: value,
    previewer: {
      dom: false,
      enablePreviewerBubble: false,
    },
    isPreviewOnly: false,
    autoScrollByCursor: true,
    forceAppend: true,
    locale: 'zh_CN',
    themeSettings: {
      toolbarTheme: isDark ? 'dark' : 'light',
      codeBlockTheme: isDark ? 'material-ocean' : 'default',
      mainTheme: isDark ? 'dark' : 'light',
      inlineCodeTheme: isDark ? 'black' : 'red',
      themeList: []
    },
    engine: {
      syntax: {
        codeBlock: {
          lineNumber: true
        },
        header: {
          anchorStyle: 'none'
        },
        toc: {
          allowMultiToc: false
        },
        table: {},
      },
      global: {
        urlProcessor: (url: string, srcType: string) => {
          if (srcType === 'image') {
            return useAttachmentUpload.render(url)
          }
          return url;
        },
        classicBr: classicBr
      },
      customSyntax: {
        RelationArticle: {
          syntaxClass: RelationArticleSyntaxHook, // 将自定义语法对象挂载到 importHook.syntaxClass上
          force: false, // true： 当cherry自带的语法中也有一个“importHook”时，用自定义的语法覆盖默认语法； false：不覆盖
          before: 'fontEmphasis', // 定义该自定义语法的执行顺序，当前例子表明在加粗/斜体语法前执行该自定义语法
        },
      },
    },
    editor: {
      defaultModel: model,
      codemirror: {
        theme: useGlobalStore().isDark ? 'material-ocean' : 'default',
      },
      keyMap: mdEditorKeyMap
    },
    toolbars: {
      showToolbar: true,
      toolbar: toolbar,
      toolbarRight: ['fullScreen', '|'],
      bubble: bubble, // array or false
      sidebar: ['settings'],
      toc: {
        updateLocationHash: false, // 要不要更新URL的hash
        defaultModel: 'pure', // pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题,
      },
      customMenu
    },
    callback: {
      afterChange(value: string) {
        update && update(value)
      },
      onClickPreview: onClickPreview
    },
    fileUpload: (file, callback) => {
      if (instance) {
        useAttachmentUpload.upload(file, file.name, file.type)
          .then(({name, key}) => {
            if (instance.value) {
              instance.value.insertValue(`![${name}#100%](attachment:${key})`);
            } else {
              callback(key, {name})
            }
          })
          .catch(e => MessageUtil.error("图片上传失败", e))
      }

    },
  };

}
