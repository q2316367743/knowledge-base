import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './plugin/router';
import {utools}from '@/plugin/utools';

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';
// 样式
import '@arco-design/web-vue/dist/arco.css';
import '@/less/customer.less';
import '@/less/index.less';
import "@/less/post.css"
import "@/less/typo.less"
import 'vue3-calendar-heatmap/dist/style.css';
import 'bytemd/dist/index.css'

// utools注入
window.utools = window.utools || utools;

createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .use(router)
    .mount('#app');

import { statistics } from './global/BeanFactory';
statistics.init();
statistics.open();
