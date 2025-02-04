import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {TodoItemIndex} from "@/entity/todo/TodoItem";

export const useTodoItemStore = defineStore('todoItem', () => {
  const items: Ref<Array<TodoItemIndex>> = ref(new Array<any>());
  const rev = ref<string>();
  let key = '';


  async function init(id: number) {
    const key = LocalNameEnum.TODO_CATEGORY + id;
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

  async function updateById(id: number, item: Partial<TodoItemIndex>) {
    // 更新
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return;
    }
    items.value[index] = {
      ...items.value[index],
      ...item,
    };
    // 同步
    await _sync()
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

  return {
    items,
    init,
    add,
    updateById,
    deleteById,deleteByBatchId
  }
})