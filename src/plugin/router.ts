import {useUmami} from "@/plugin/umami";
import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 引入路由

const routers: Array<RouteRecordRaw> = [{
  name: "主页",
  path: '/',
  redirect: '/note'
}, {
  name: "首页",
  path: '/home',
  component: () => import('@/pages/home/home.vue'),
}, {
  name: "资讯",
  path: '/news',
  component: () => import('@/pages/news/news.vue'),
  children: [
    {
      name: "资讯-项",
      path: "item/:id",
      component: () => import('@/pages/news/item/index.vue')
    }, {
      name: "资讯-详情",
      path: "content/:id",
      component: () => import('@/pages/news/content/index.vue')
    }
  ]
}, {
  name: "笔记",
  path: '/note',
  component: () => import('@/pages/note/note.vue')
}, {
  name: "待办",
  path: '/todo',
  component: () => import("@/pages/todo/todo.vue")
}, {
  name: "工具",
  path: "/tool",
  component: () => import("@/pages/tool/index.vue"),
  children: [
    {
      name: "工具-搜索内容",
      path: "search",
      component: () => import("@/pages/tool/search/index.vue")
    }, {
      name: "工具-回收站",
      path: "recycle",
      component: () => import("@/pages/tool/recycle/index.vue")
    }, {
      name: "工具-分类",
      path: "category",
      component: () => import("@/pages/tool/category/index.vue")
    }
  ]
}, {
  name: "设置",
  path: "/setting",
  component: () => import("@/pages/setting/index.vue"),
  redirect: "/setting/base",
  children: [
    {
      name: "设置-基础",
      path: "base",
      component: () => import("@/pages/setting/base/components/BaseSetting.vue")
    }, {
      name: "设置-模块",
      path: "module",
      component: () => import("@/pages/setting/base/components/ModuleSetting.vue")
    }, {
      name: "设置-代码笔记",
      path: "code-editor",
      component: () => import("@/pages/setting/base/components/CodeEditorSetting.vue")
    }, {
      name: "设置-主题",
      path: "theme",
      component: () => import("@/pages/setting/base/components/ThemeSetting.vue")
    }, {
      name: "设置-代码运行",
      path: "code-run",
      component: () => import("@/pages/setting/code-run/index.vue")
    }, {
      name: "设置-ai服务",
      path: "ai-service",
      component: () => import("@/pages/setting/ai-service/index.vue")
    }, {
      name: "设置-ai助手",
      path: "ai-assistant",
      component: () => import("@/pages/setting/ai-assistant/index.vue")
    }
  ]
}, {
  name: "更多",
  path: "/more",
  component: () => import("@/pages/more/index.vue"),
  redirect: "/more/about",
  children: [
    {
      name: "更多-备份",
      path: "backup",
      component: () => import("@/pages/more/backup/index.vue")
    }, {
      name: "更多-附件管理",
      path: "attachment",
      component: () => import("@/pages/more/attachment/index.vue")
    }, {
      name: "更多-推荐",
      path: "recommend",
      component: () => import("@/pages/more/recommend/index.vue")
    }, {
      name: "更多-更新",
      path: "update",
      component: () => import("@/pages/more/update-log/index.vue")
    }, {
      name: "更多-关于",
      path: "about",
      component: () => import("@/pages/more/about/index.vue")
    }
  ]
}];


const router = createRouter({
  history: createWebHashHistory(),
  routes: routers
});


router.beforeEach(to => {
  useUmami.page(to.path, to.name as string)
})

export default router;
