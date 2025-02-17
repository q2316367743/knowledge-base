import ArcoVue, {Drawer} from "@arco-design/web-vue";
import {createApp, ref, watch} from "vue";
import CategoryManage from "@/pages/note/components/CategoryManage.vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

export function openCategoryManageDrawer() {
    const app = createApp({
        setup() {
            return () => <CategoryManage />
        }
    });
    app.use(ArcoVue);
    app.use(ArcoVueIcon);
    const appRef = ref<HTMLDivElement>();

    watch(appRef, value =>  {
        if (value) {
            app.mount(value);
        }
    })
    Drawer.open({
        title: '分类管理',
        width: 400,
        footer: false,
        content: () => <div ref={appRef}></div>
    })
}
