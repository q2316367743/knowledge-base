import {useUmami} from "@/plugin/umami";
import {createApp} from 'vue'
import {createPinia} from 'pinia';
import App from './App.vue'
import {setupCalendar} from 'v-calendar';
import router from './plugin/router';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@arco-design/web-vue/es/message/style/css.js'
import '@arco-design/web-vue/es/drawer/style/css.js'
import '@arco-design/web-vue/es/modal/style/css.js'
import '@arco-design/web-vue/es/notification/style/css.js'
import '@/assets/style/global.less';
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'v-calendar/style.css';
import 'virtual:uno.css'
import 'handsontable/dist/handsontable.full.min.css';
import '@wangeditor/editor/dist/css/style.css';
import '@logicflow/core/dist/index.css';
import '@logicflow/extension/dist/index.css';
// 代码编辑器
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// 富文本编辑器
import { Boot } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'
// 其他
import {isUtools, useDeleteEvent, useSearchContentEvent} from '@/global/BeanFactory';
import {useArticleExportEvent, useArticlePreviewEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {addArticleModal} from "@/pages/home/components/he-context";

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
  .use(ArcoVueIcon)
  .use(setupCalendar, {})
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
      useArticlePreviewEvent.emit(useHomeEditorStore().id);
      useUmami.track("使用快捷键", getKey(e));
    } else if (e.code === 'KeyP') {
      e.preventDefault();
      e.stopPropagation();
      useArticleExportEvent.emit(useHomeEditorStore().id);
      useUmami.track("使用快捷键", getKey(e));
    }
    if (e.shiftKey) {
      if (e.code === 'KeyF') {
        // 全局搜索
        e.preventDefault();
        useSearchContentEvent.emit();
        useUmami.track("使用快捷键", getKey(e));
      }
    }
  }
});

window.open = (url?: string | URL): WindowProxy | null => {
  if (!url) {
    return null;
  }
  utools.shellOpenExternal(typeof url === 'string' ? url : url?.toString());
  return null;

}
window.addEventListener('click', e => {
  if (!isUtools) {
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
      utools.shellOpenExternal(href);
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }
});
