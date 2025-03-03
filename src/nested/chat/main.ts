import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@arco-design/web-vue/es/message/style/css.js'
import 'tdesign-vue-next/es/style/index.css';
import '@/assets/style/theme.css';
import '@/assets/style/global.less';
import 'virtual:uno.css';
import 'cherry-markdown/dist/cherry-markdown.min.css';


createApp(App)
    .use(ArcoVueIcon)
    .use(createPinia())
    .mount('#app');
