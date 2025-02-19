import {useUmami} from "@/plugin/umami";
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
  name: "笔记",
  path: '/note',
  component: () => import('@/pages/note/index.vue')
}, {
  name: "待办",
  path: '/todo',
  component: () => import("@/pages/todo/index.vue")
}, {
  name: "插件",
  path: "/plugin",
  component: () => import("@/pages/plugin/index.vue")
}, {
  name: "工具-搜索内容",
  path: "/tool/search",
  component: () => import("@/pages/tool/search/index.vue")
}, {
  name: "工具-回收站",
  path: "/tool/recycle",
  component: () => import("@/pages/tool/recycle/index.vue")
}, {
  name: "工具-分类",
  path: "/tool/category",
  component: () => import("@/pages/tool/category/index.vue")
}, {
  name: "设置",
  path: "/setting",
  component: () => import("@/pages/setting/index.vue"),
  children: [{
    name: "设置-基础",
    path: "base",
    component: () => import("@/pages/setting/base/index.vue")
  }, {
    name: "设置-代码运行",
    path: "code-run",
    component: () => import("@/pages/setting/code-run/index.vue")
  }, {
    name: "设置-ai服务",
    path: "ai-service",
    component: () => import("@/pages/setting/ai-service/index.vue")
  }, {
    name: "设置-关键字",
    path: "feature",
    component: () => import("@/pages/setting/feature/index.vue")
  }]
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


router.beforeEach(to => {
  useUmami.page(to.path, to.name as string)
})

export default router;
