import {createApp} from 'vue'
import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';

window.utools = window.utools || utools;

createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .mount('#app');
