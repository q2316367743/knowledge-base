import {createRouter, createWebHashHistory} from 'vue-router';
// 引入路由

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        name: "主页",
        path: '/',
        redirect: '/home'
    }, {
        name: "首页",
        path: '/home',
        component: () => import('@/pages/home/index.vue')
    }, {
        name: "编辑文章",
        path: '/editor/:id',
        component: () => import("@/pages/editor/index.vue")
    }, {
        name: '阅读文章',
        path: '/article/:id',
        component: () => import("@/pages/article/index.vue"),
    }, {
        name: "空间",
        path: '/zone',
        component: () => import("@/pages/zone/index.vue")
    }, {
        name: "离线网页",
        path: '/html',
        component: () => import("@/pages/html/index.vue")
    }, {
        name: "时间线",
        path: "/timeline",
        component: () => import("@/pages/timeline/index.vue")
    }, {
        name: "图",
        path: "/graph",
        component: () => import("@/pages/graph/index.vue")
    }, {
        name: "基础设置",
        path: "/setting/base",
        component: () => import("@/pages/setting/base/index.vue")
    }, {
        name: "分类设置",
        path: "/setting/category",
        component: () => import("@/pages/setting/category/index.vue")
    }, {
        name: "备份设置",
        path: "/setting/backup",
        component: () => import("@/pages/setting/backup/index.vue")
    }, {
        name: "附件管理",
        path: "/more/attachment",
        component: () => import("@/pages/more/attachment/index.vue")
    }, {
        name: "推荐",
        path: "/more/recommend",
        component: () => import("@/pages/more/recommend/index.vue")
    }, {
        name: "关于",
        path: "/more/about",
        component: () => import("@/pages/more/about/index.vue")
    }]
});

export default router;
