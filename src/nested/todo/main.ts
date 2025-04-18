import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
// 样式
import 'tdesign-vue-next/es/style/index.css';
import 'virtual:uno.css'
import '@wangeditor/editor/dist/css/style.css';
import '@/assets/style/global.less';
import '@arco-design/web-vue/dist/arco.css';
import '@arco-design/web-vue/es/drawer/style/css.js'

createApp(App)
    .use(createPinia())
    .mount('#app');
