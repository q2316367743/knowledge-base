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
import '@wangeditor/editor/dist/css/style.css'
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'v-calendar/style.css';
import 'virtual:uno.css'
import 'handsontable/dist/handsontable.full.min.css';
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
// 安装wangEditor插件
import {Boot} from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'
import {OpenByUtoolsMenu} from "@/components/WangEditor/OpenByUtools";
import {useDeleteEvent, useNewEvent, useSearchContentEvent} from './global/BeanFactory';
import {track} from "@/plugin/Statistics";
import {useArticleExportEvent, useArticlePreviewEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";

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



Boot.registerModule(markdownModule);
Boot.registerMenu(OpenByUtoolsMenu);

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey) {
        if (e.code === 'KeyN') {
            e.preventDefault();
            useNewEvent.emit();
            track('keymap', {
                ctrl: e.ctrlKey ? 'true' : 'false',
                alt: e.altKey ? 'true' : 'false',
                code: e.code,
            });
        } else if (e.code === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            useDeleteEvent.emit();
            track('keymap', {
                ctrl: e.ctrlKey ? 'true' : 'false',
                alt: e.altKey ? 'true' : 'false',
                code: e.code,
            });
        }else if(e.code == 'KeyQ') {
            e.preventDefault();
            e.stopPropagation();
            useArticlePreviewEvent.emit(useHomeEditorStore().id);
        }else if (e.code === 'KeyP') {
            e.preventDefault();
            e.stopPropagation();
            useArticleExportEvent.emit(useHomeEditorStore().id);
        }
        if (e.shiftKey) {
            if (e.code === 'KeyF') {
                // 全局搜索
                e.preventDefault();
                useSearchContentEvent.emit();
                track('keymap', {
                    ctrl: e.ctrlKey ? 'true' : 'false',
                    alt: e.altKey ? 'true' : 'false',
                    code: e.code,
                });
            }
        }
    }
});
