import {createApp} from 'vue'
import {createPinia} from 'pinia';
import App from './App.vue'
import {setupCalendar} from 'v-calendar';
import router from './plugin/router';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'v-calendar/style.css';
import 'virtual:uno.css'
import 'handsontable/dist/handsontable.full.min.css';
import 'aieditor/dist/style.css'
// 编辑器
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import {isUtools, useDeleteEvent, useSearchContentEvent} from '@/global/BeanFactory';
import {access} from "@/plugin/Statistics";
import {useArticleExportEvent, useArticlePreviewEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {addArticleModal} from "@/pages/home/components/he-context";

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

createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .use(router)
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
            access("使用快捷键", getKey(e));
        } else if (e.code === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            useDeleteEvent.emit();
            access("使用快捷键", getKey(e));
        } else if (e.code == 'KeyQ') {
            e.preventDefault();
            e.stopPropagation();
            useArticlePreviewEvent.emit(useHomeEditorStore().id);
            access("使用快捷键", getKey(e));
        } else if (e.code === 'KeyP') {
            e.preventDefault();
            e.stopPropagation();
            useArticleExportEvent.emit(useHomeEditorStore().id);
            access("使用快捷键", getKey(e));
        }
        if (e.shiftKey) {
            if (e.code === 'KeyF') {
                // 全局搜索
                e.preventDefault();
                useSearchContentEvent.emit();
                access("使用快捷键", getKey(e));
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
    const ele = e.target as HTMLElement;
    if (ele && ele.tagName && ele.tagName.toUpperCase() === 'A') {
        // a标签
        const href = ele.getAttribute('href');
        if (href) {
            utools.shellOpenExternal(href);
            e.preventDefault();
            e.stopPropagation();
        }
    }
});
