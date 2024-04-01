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
import '@/less/customer.less';
import '@/less/index.less';
import '@wangeditor/editor/dist/css/style.css'
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'v-calendar/style.css';


createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .use(router)
    .use(setupCalendar, {})
    .mount('#app');

import {statistics, useDeleteEvent, useNewEvent} from './global/BeanFactory';

statistics.init();
statistics.open();

// 安装wangEditor插件
import {Boot} from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'
import {OpenByUtoolsMenu} from "@/components/WangEditor/OpenByUtools";

Boot.registerModule(markdownModule);
Boot.registerMenu(OpenByUtoolsMenu);

window.onload = () => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.ctrlKey || e.altKey) {
            if (e.code === 'KeyN') {
                e.preventDefault();
                useNewEvent.emit();
            }else if (e.code === 'Delete') {
                e.preventDefault();
                useDeleteEvent.emit();
            }

        }
    });
}

