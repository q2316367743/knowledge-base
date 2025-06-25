import {createPinia} from 'pinia';
import App from './App.vue'
// 额外引入图标库
// 样式
import 'tdesign-vue-next/es/style/index.css';
import 'cherry-markdown/dist/cherry-markdown.min.css'
import 'virtual:uno.css'
import 'handsontable/dist/handsontable.full.min.css';
import '@logicflow/core/dist/index.css';
import '@logicflow/extension/dist/index.css';
import '@/assets/style/global.less';

createApp(App)
    .use(createPinia())
    .mount('#app');
