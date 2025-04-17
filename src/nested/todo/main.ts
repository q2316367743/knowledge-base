import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
// 样式
import 'tdesign-vue-next/es/style/index.css';
import 'virtual:uno.css'
import '@wangeditor/editor/dist/css/style.css';
import '@/assets/style/global.less';

createApp(App)
    .use(createPinia())
    .mount('#app');
