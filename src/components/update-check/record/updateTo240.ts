import {getFromOneByAsync, listRecordByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {TodoItemAttr, TodoItemContent} from "@/entity/todo/TodoItem";
import MessageUtil from "@/utils/modal/MessageUtil";

export async function updateTo240() {
  const contents = await listRecordByAsync<TodoItemContent>(LocalNameEnum.TODO_ITEM);
  let error = false;
  for (let content of contents) {
    const {record} = content;
    if (record) {
      const attr = await getFromOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + record.id);
      if (attr.record) {
        try {
          await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + record.id, {
            ...attr.record,
            tags: record.tags
          }, attr.rev);
        } catch (e) {
          error = true;
          console.error(e);
        }
      }
    }
  }
  if (error) {
    MessageUtil.warning("数据同步存在异常，可能存在待办标签丢失问题");
  }
}