import {Drawer} from "@arco-design/web-vue";
import CategoryManage from "@/pages/note/components/CategoryManage.vue";

export function openCategoryManageDrawer() {
  Drawer.open({
    title: '分类管理',
    width: 400,
    footer: false,
    content: () => <CategoryManage/>
  })
}
