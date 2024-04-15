import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 引入路由

const routers: Array<RouteRecordRaw> = [{
    name: "主页",
    path: '/',
    redirect: '/home'
}, {
    name: "首页",
    path: '/home',
    component: () => import('@/nested/todo/pages/home/index.vue')
}, {
    name: "待办",
    path: '/info/:id',
    component: () => import('@/nested/todo/pages/info/index.vue')
}, {
    name: "设置",
    path: '/setting',
    component: () => import('@/nested/todo/pages/setting/index.vue')
}];


const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});

export default router;
