import {
  DbRecord,
  getFromOneWithDefaultByAsync,
  listByAsync, listRecordByAsync, removeOneByAsync,
  saveListByAsync,
  saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
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

  const todoItemAttrMap = new Map<number, TodoItemAttr>();
  const todoItemContentMap = new Map<number, DbRecord<TodoItemContent>>();


  async function init(id: number) {
    key = LocalNameEnum.TODO_CATEGORY + id;
    // 清空
    items.value = [];
    rev.value = undefined;

    try {
      const res = await listByAsync<TodoItemIndex>(key);
      items.value = res.list;
      rev.value = res.rev;
      todoItemAttrMap.clear();
      todoItemContentMap.clear();
    } catch (e) {
      console.error('初始化待办项失败', e);
    }
  }

  async function _sync() {
    rev.value = await saveListByAsync(key, items.value, rev.value);
  }

  async function deleteById(id: number) {
    // 删除
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return;
    }
    items.value.splice(index, 1);
    // 同步
    await _sync();
    // 删除属性
    await removeOneByAsync(LocalNameEnum.TODO_ATTR + id, true);
    // 删除内容
    await removeOneByAsync(LocalNameEnum.TODO_ITEM + id, true);
    // 移除缓存
    todoItemAttrMap.delete(id);
    todoItemContentMap.delete(id);
  }

  async function deleteByBatchId(ids: Array<number>) {
    items.value = items.value.filter(e => !ids.includes(e.id));
    await _sync();
    for (let id of ids) {
      // 删除属性
      await removeOneByAsync(LocalNameEnum.TODO_ATTR + id, true);
      // 删除内容
      await removeOneByAsync(LocalNameEnum.TODO_ITEM + id, true);
      // 移除缓存
      todoItemAttrMap.delete(id);
      todoItemContentMap.delete(id);
    }
  }

  // ------------------------------- 更新相关 -------------------------------

  async function updateById(id: number, record: Partial<TodoItemIndex>, attr?: Partial<TodoItemAttr>) {
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("待办项不存在");
    }
    if (record.status === TodoItemStatus.COMPLETE || attr) {
      // 将状态改为完成，则需要记录完成时间
      // 获取旧的属性
      let old = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
      const target: TodoItemAttr = {
        ...old.record,
        ...(attr || {})
      }
      if (record.status === TodoItemStatus.COMPLETE) {
        // 记录完成时间
        target.completeTime = new Date()
      }

      await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + id, target, old.rev);
      // 重置缓存
      todoItemAttrMap.set(id, target);
    }

    items.value[index] = {
      ...items.value[index],
      ...record,
      updateTime: new Date(),
    };
    // 同步
    await _sync();
    return items.value[index];
  }

  async function saveContent(id: number, content: TodoItemContent, rev?: string): Promise<string | undefined> {
    todoItemContentMap.delete(id);
    return saveOneByAsync(LocalNameEnum.TODO_ITEM + id, content, rev)
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
    const attr = todoItemAttrMap.get(id);
    if (attr) return attr;
    if (id === 0) {
      return Promise.reject("待办项不存在");
    }
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("待办项不存在");
    }
    let attrDbRecord = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
    todoItemAttrMap.set(id, attrDbRecord.record);
    return Promise.resolve(attrDbRecord.record);
  }


  async function getMultiTodoItemAttr(ids: Array<number>): Promise<Array<DbRecord<TodoItemAttr>>> {
    return listRecordByAsync(ids.map(id => LocalNameEnum.TODO_ATTR + id))
  }

  async function getTodoItemContent(id: number): Promise<DbRecord<TodoItemContent>> {
    const content = todoItemContentMap.get(id);
    if (content) return Promise.resolve(content);
    if (id === 0) {
      return Promise.reject("待办项不存在");
    }
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("待办项不存在");
    }
    let attrDbRecord = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ITEM + id, getDefaultTodoItemContent(id));
    todoItemContentMap.set(id, attrDbRecord);
    return Promise.resolve(attrDbRecord);
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
    // 内容备份
    return Promise.resolve({
      index: clone(todoItem),
      content: await getTodoItemContent(id),
      attr: await getTodoItemAttr(id)
    });
  }

  return {
    items,
    init,
    addSimple,
    updateById, saveContent,
    deleteById, deleteByBatchId,
    getTodoItem, getTodoItemAttr, getMultiTodoItemAttr, getTodoItemContent
  }
})