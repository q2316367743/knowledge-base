import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@arco-design/web-vue/es/message/style/css.js'
import '@arco-design/web-vue/es/drawer/style/css.js'
import '@arco-design/web-vue/es/modal/style/css.js'
import '@arco-design/web-vue/es/notification/style/css.js'
import 'tdesign-vue-next/es/style/index.css';
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'virtual:uno.css'
import 'handsontable/dist/handsontable.full.min.css';
import '@wangeditor/editor/dist/css/style.css';
import '@logicflow/core/dist/index.css';
import '@logicflow/extension/dist/index.css';
import 'nprogress/nprogress.css';
import '@/assets/style/global.less';

window.utools = window.utools || utools;

createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .mount('#app');
