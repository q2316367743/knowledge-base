import {getFromOneWithDefaultByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {getDefaultTodoItemAttr, TodoItemAttr, TodoItemIndex, TodoItemStatus} from "@/entity/todo/TodoItem";

export const useTodoItemStore = defineStore('todoItem', () => {
  const items: Ref<Array<TodoItemIndex>> = ref(new Array<any>());
  const rev = ref<string>();
  let key = '';


  async function init(id: number) {
    key = LocalNameEnum.TODO_CATEGORY + id;
    // 清空
    items.value = [];
    rev.value = undefined;

    try {
      const res = await listByAsync<TodoItemIndex>(key);
      items.value = res.list;
      rev.value = res.rev;
    } catch (e) {
      console.error('初始化待办项失败', e);
    }
  }

  async function _sync() {
    rev.value = await saveListByAsync(key, items.value, rev.value);
  }

  async function add(item: TodoItemIndex) {
    // 添加
    items.value.push(item);
    // 同步
    await _sync()
  }

  async function updateById(id: number, record: Partial<TodoItemIndex>) {
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("待办项不存在");
    }
    if (record.status === TodoItemStatus.COMPLETE) {
      // 将状态改为完成，则需要记录完成时间
      // 获取旧的属性
      let old = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
      // 记录完成时间
      await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + id, {
        ...old.record,
        completeTime: new Date()
      }, old.rev);
    }

    items.value[index] = {
      ...items.value[index],
      ...record,
      updateTime: new Date(),
    };
    // 同步
    await _sync();
  }

  async function deleteById(id: number) {
    // 删除
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return;
    }
    items.value.splice(index, 1);
    // 同步
    await _sync()
  }

  async function deleteByBatchId(ids: Array<number>) {
    items.value = items.value.filter(e => !ids.includes(e.id));
    await _sync();
  }

  // ------------------------------- 查询相关 -------------------------------


  async function getTodoItemAttr(id: number): Promise<TodoItemAttr> {
    if (id === 0) {
      return Promise.reject("待办项不存在");
    }
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("待办项不存在");
    }
    let attrDbRecord = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
    return Promise.resolve(attrDbRecord.record);
  }

  return {
    items,
    init,
    add,
    updateById,
    deleteById, deleteByBatchId,
    getTodoItemAttr
  }
})