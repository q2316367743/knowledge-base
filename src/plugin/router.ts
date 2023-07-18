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
        name: "编辑器",
        path: '/editor/:id',
        component: () => import("@/pages/editor/index.vue")
    }, {
        name: '文章',
        path: '/article/:id',
        component: () => import("@/pages/article/index.vue"),
    }, {
        name: "空间",
        path: '/zone',
        component: () => import("@/pages/zone/index.vue")
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
        path: "/more/setting/base",
        component: () => import("@/pages/more/setting/base/index.vue")
    }, {
        name: "分类设置",
        path: "/more/setting/category",
        component: () => import("@/pages/more/setting/category/index.vue")
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
