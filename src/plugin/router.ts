import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
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
    name: "图-搜索",
    path: "/graph/search",
    component: () => import("@/pages/graph/search/index.vue")
}, {
    name: "图-回收站",
    path: "/graph/recycle",
    component: () => import("@/pages/graph/recycle/index.vue")
}, {
    name: "图-关联",
    path: "/graph/relation",
    component: () => import("@/pages/graph/relation/index.vue")
}, {
    name: "图-分类",
    path: "/graph/category",
    component: () => import("@/pages/graph/category/index.vue")
}, {
    name: "图-时间线",
    path: "/graph/timeline",
    component: () => import("@/pages/graph/timeline/index.vue")
}, {
    name: "设置-基础",
    path: "/setting/base",
    component: () => import("@/pages/setting/base/index.vue")
}, {
    name: "设置-主题",
    path: "/setting/theme",
    component: () => import("@/pages/setting/theme/index.vue")
}, {
    name: "设置-分类",
    path: "/setting/category",
    component: () => import("@/pages/setting/category/index.vue")
}, {
    name: "设置-备份",
    path: "/setting/backup",
    component: () => import("@/pages/setting/backup/index.vue")
}, {
    name: "设置-兰空图床",
    path: "/setting/lsky-pro",
    component: () => import("@/pages/setting/lsky-pro/index.vue")
}, {
    name: "设置-关键字",
    path: "/setting/feature",
    component: () => import("@/pages/setting/feature/index.vue")
}, {
    name: "附件管理",
    path: "/more/attachment",
    component: () => import("@/pages/more/attachment/index.vue")
}, {
    name: "推荐",
    path: "/more/recommend",
    component: () => import("@/pages/more/recommend/index.vue")
}, {
    name: "vip",
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

if (Constant.platform === PlatformTypeEnum.DOCKER ||
    Constant.platform === PlatformTypeEnum.TAURI) {
    routers.push({
        name: "登录",
        path: '/login',
        component: () => import('@/pages/login/index.vue')
    });
}

const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});

export default router;
