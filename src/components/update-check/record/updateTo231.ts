import {getFromOneByAsync, listRecordByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {TodoItemAttr, TodoItemIndex, TodoItemStatus} from "@/entity/todo/TodoItem";
import {isNotEmptyArray} from "@/utils/lang/FieldUtil";

export async function updateTo231() {
    // 获取全部的待办列表
    const records = await listRecordByAsync<Array<TodoItemIndex>>(LocalNameEnum.TODO_CATEGORY);
    for (const record of records) {
        const indexes = record.record;
        if (isNotEmptyArray(indexes)) {
            for (let index of indexes) {
                // 如果是完成状态
                if (index.status === TodoItemStatus.COMPLETE) {
                    // 获取待办属性
                    const attr = await getFromOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR  +   index.id);
                    if (attr.record) {
                        // 更新完成时间
                        await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR  +   index.id, {
                            ...attr.record,
                            // 完成时间设置为最后更新时间
                            completeTime: index.updateTime
                        }, attr.rev);
                    }
                }
            }
        }
    }
}
