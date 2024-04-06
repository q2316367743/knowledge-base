import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 引入路由

const routers: Array<RouteRecordRaw> = [{
    name: "主页",
    path: '/',
    redirect: '/home'
}, {
    name: "首页",
    path: '/home',
    component: () => import('@/pages/home/index.vue')
}, {
    name: "待办",
    path: '/todo',
    component: () => import("@/pages/todo/index.vue")
}, {
    name: "工具-搜索内容",
    path: "/tool/search",
    component: () => import("@/pages/tool/search/index.vue")
}, {
    name: "工具-回收站",
    path: "/tool/recycle",
    component: () => import("@/pages/tool/recycle/index.vue")
}, {
    name: "工具-插件",
    path: "/tool/plugin",
    component: () => import("@/pages/tool/plugin/index.vue")
}, {
    name: "工具-分类",
    path: "/tool/category",
    component: () => import("@/pages/tool/category/index.vue")
}, {
    name: "设置-基础",
    path: "/setting/base",
    component: () => import("@/pages/setting/base/index.vue")
}, {
    name: "设置-分类",
    path: "/setting/category",
    component: () => import("@/pages/setting/category/index.vue")
}, {
    name: "设置-兰空图床",
    path: "/setting/lsky-pro",
    component: () => import("@/pages/setting/lsky-pro/index.vue")
}, {
    name: "设置-关键字",
    path: "/setting/feature",
    component: () => import("@/pages/setting/feature/index.vue")
}, {
    name: "更多-备份",
    path: "/more/backup",
    component: () => import("@/pages/more/backup/index.vue")
}, {
    name: "更多-附件管理",
    path: "/more/attachment",
    component: () => import("@/pages/more/attachment/index.vue")
}, {
    name: "更多-推荐",
    path: "/more/recommend",
    component: () => import("@/pages/more/recommend/index.vue")
}, {
    name: "更多-vip",
    path: "/more/vip",
    component: () => import("@/pages/more/vip/index.vue")
}, {
    name: "更新",
    path: "/more/update",
    component: () => import("@/pages/more/update-log/index.vue")
}, {
    name: "关于",
    path: "/more/about",
    component: () => import("@/pages/more/about/index.vue")
}];


const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});

export default router;
