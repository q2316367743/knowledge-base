import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {removeFeatureOne} from "@/utils/utools/FeatureUtil";
import Constant from "@/global/Constant";

export async function removeTodoCode() {
    const keyword = await MessageBoxUtil.prompt("请输入要删除的待办名称")
    const index = useTodoCategoryStore().value.findIndex(e => e.name === keyword);
    if (index === -1) {
        MessageUtil.warning("未找到该待办")
        return;
    }
    const category = useTodoCategoryStore().value[index];
    removeFeatureOne(Constant.feature.TODO_CATEGORY + category.id);
    MessageUtil.success("删除成功")
}
