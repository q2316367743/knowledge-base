import {useUmami} from "@/plugin/umami";
import {createPinia} from 'pinia';
import App from './App.vue'
import router from './plugin/router';
// 样式
import 'tdesign-vue-next/es/style/index.css';
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'virtual:uno.css'
import 'handsontable/dist/handsontable.full.min.css';
import '@wangeditor/editor/dist/css/style.css';
import '@logicflow/core/dist/index.css';
import '@logicflow/extension/dist/index.css';
import '@/assets/style/global.less';
import 'splitpanes/dist/splitpanes.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// 代码编辑器
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// 富文本编辑器
import {Boot} from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'
// 其他
import {useDeleteEvent} from '@/global/BeanFactory';
import {
  homeEditorId,
  useArticleExportEvent,
  useArticlePreviewEvent,
} from "@/store/components/HomeEditorStore";
import {addArticleModal} from "@/pages/note/components/he-context";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {openSearchContent} from "@/pages/note/components/SearchContent";

// 代码编辑器环境注册
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (['css', 'scss', 'less'].includes(label)) {
      return new cssWorker()
    }
    if (['html', 'handlebars', 'razor'].includes(label)) {
      return new htmlWorker()
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker()
    }
    return new EditorWorker()
  },
}
// 富文本编辑器注册插件
Boot.registerModule(markdownModule);

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app');

function getKey(e: KeyboardEvent) {
  const keys = new Array<string>();
  e.ctrlKey && keys.push('ctrl');
  e.altKey && keys.push('alt');
  e.shiftKey && keys.push('shift');
  keys.push(e.code);
  return keys.join(" | ");
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.ctrlKey || e.altKey) {
    if (e.code === 'KeyN') {
      e.preventDefault();
      addArticleModal();
      useUmami.track("使用快捷键", getKey(e));
    } else if (e.code === 'Delete') {
      e.preventDefault();
      e.stopPropagation();
      useDeleteEvent.emit();
      useUmami.track("使用快捷键", getKey(e));
    } else if (e.code == 'KeyQ') {
      e.preventDefault();
      e.stopPropagation();
      useArticlePreviewEvent.emit(homeEditorId.value);
      useUmami.track("使用快捷键", getKey(e));
    } else if (e.code === 'KeyP') {
      e.preventDefault();
      e.stopPropagation();
      useArticleExportEvent.emit(homeEditorId.value);
      useUmami.track("使用快捷键", getKey(e));
    }
    if (e.shiftKey) {
      if (e.code === 'KeyF') {
        // 全局搜索
        e.preventDefault();
        useUmami.track("使用快捷键", getKey(e));
        openSearchContent();
      }
    }
  }
});

window.addEventListener('click', e => {
  if (InjectionUtil.getPlatform() === 'web') {
    // web不需要监听
    return;
  }
  // @ts-ignore
  const elements: Array<HTMLElement> = e.path;
  for (let element of elements) {
    if (element.tagName && element.tagName.toLowerCase() === 'a') {
      const href = (element as HTMLLinkElement).href;
      if (href.startsWith("http://localhost:5173")) {
        return;
      }
      InjectionUtil.shellOpenExternal(href);
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }
});
