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
  component: () => import('@/nested/feedback/pages/home/index.vue')
}, {
  name: "新增反馈",
  path: '/post',
  component: () => import('@/nested/feedback/pages/post/index.vue')
}, {
  name: "反馈详情",
  path: '/info/:id',
  component: () => import('@/nested/feedback/pages/info/index.vue')
}];


const router = createRouter({
  history: createWebHashHistory(),
  routes: routers
});


router.beforeEach(to => {
  useUmami.page(to.path, to.name as string)
})

export default router;
