import {DrawerPlugin} from 'tdesign-vue-next';
import CategoryManage from "@/pages/note/components/CategoryManage.vue";

export function openCategoryManageDrawer() {
  DrawerPlugin({
    header: '分类管理',
    size: '400px',
    footer: false,
    default: () => <CategoryManage/>
  })
}
