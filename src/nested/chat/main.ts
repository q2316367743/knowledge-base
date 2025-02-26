import {createApp} from 'vue'
import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 样式
import '@/assets/style/theme.css';
import '@/assets/style/global.less';
import 'virtual:uno.css';
import 'cherry-markdown/dist/cherry-markdown.min.css';


createApp(App)
    .use(ArcoVueIcon)
    .use(createPinia())
    .mount('#app');
