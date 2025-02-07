import {getFromOneWithDefaultByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {
  getDefaultTodoItemAttr, getDefaultTodoItemContent,
  getDefaultTodoItemIndex, TodoItem,
  TodoItemAttr, TodoItemContent,
  TodoItemIndex,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {useUmami} from "@/plugin/umami";
import {clone} from "@/utils/lang/ObjectUtil";

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

  // ------------------------------- 新增相关 -------------------------------

  async function addSimple(categoryId: number, record: Partial<TodoItemIndex>, attr?: Partial<TodoItemAttr>): Promise<TodoItemIndex> {
    if (!record.title) {
      return Promise.reject("请输入内容");
    }
    if (record.title.trim() === '') {
      return Promise.reject("请输入内容");
    }
    if (categoryId === 0) {
      return Promise.reject("请选择清单");
    }
    const id = new Date().getTime();
    const item: TodoItemIndex = {
      ...getDefaultTodoItemIndex(id),
      ...record
    };
    if (attr) {
      // 由于数据量不大，就直接查询
      let old = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
      // 如果存在内容，则一并更新
      await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + id, {
        ...old.record,
        ...attr
      }, old.rev);
    }
    // 新增内容
    await saveOneByAsync<TodoItemContent>(LocalNameEnum.TODO_ITEM + id, getDefaultTodoItemContent(id));
    // 新增到当前列表
    items.value.push(item);
    // 同步
    await _sync();
    useUmami.track("/待办/新增")
    return item;
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

  async function getTodoItem(id: number): Promise<TodoItem> {
    if (id === 0) {
      return Promise.reject("待办项不存在");
    }
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("待办项不存在");
    }
    const todoItem = items.value[index];
    const content = await getFromOneWithDefaultByAsync(
      LocalNameEnum.TODO_ITEM + todoItem.id,
      getDefaultTodoItemContent(todoItem.id));
    // 内容备份
    return Promise.resolve({
      index: clone(todoItem),
      content: content,
      attr: await getTodoItemAttr(id)
    });
  }

  return {
    items,
    init,
    addSimple,
    updateById,
    deleteById, deleteByBatchId,
    getTodoItem, getTodoItemAttr
  }
})