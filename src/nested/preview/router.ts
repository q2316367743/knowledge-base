import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 引入路由

const routers: Array<RouteRecordRaw> = [{
    name: "主页",
    path: '/',
    redirect: '/home'
}, {
    name: "首页",
    path: '/home',
    component: () => import('@/nested/preview/pages/home/index.vue')
}, {
    name: "预览",
    path: '/info/:id',
    component: () => import('@/nested/preview/pages/info/index.vue')
}];


const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});

export default router;
