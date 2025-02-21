import {createApp} from 'vue'
import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@arco-design/web-vue/es/message/style/css.js'
import '@arco-design/web-vue/es/drawer/style/css.js'
import '@arco-design/web-vue/es/modal/style/css.js'
import '@arco-design/web-vue/es/notification/style/css.js'
import '@/assets/style/global.less';
import 'virtual:uno.css';
import 'cherry-markdown/dist/cherry-markdown.min.css';


createApp(App)
    .use(ArcoVueIcon)
    .use(createPinia())
    .mount('#app');
