import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {TodoGroup} from "@/entity/todo/TodoGroup";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {useSnowflake} from "@/hooks/Snowflake";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {isEmptyArray, isEmptyString} from "@/utils/lang/FieldUtil";
import {toSorted} from "@/utils/lang/ArrayUtil";

export const useTodoGroupStore = defineStore('todoGroup', () => {
  const items: Ref<Array<TodoGroup>> = ref(new Array<any>());
  const rev = ref<string>();
  let key = '';

  // 初始化
  async function init(id: number) {
    key = LocalNameEnum.TODO_GROUP + id;
    // 清空
    items.value = [];
    rev.value = undefined;

    try {
      const res = await listByAsync<TodoGroup>(key);
      items.value = res.list;
      rev.value = res.rev;
    } catch (e) {
      console.error(e);
    }
  }

  // 同步
  async function _sync() {
    rev.value = await saveListByAsync(key, items.value, rev.value);
  }

  // 删除
  async function deleteById(id: string, targetGroupId: string) {
    // 删除
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return;
    }
    const target = items.value[index];
    items.value.splice(index, 1);
    if (targetGroupId === '-1') {
      // 删除全部待办项
      await useTodoItemStore().deleteByBatchId(target.items);
    } else if (targetGroupId !== '0') {
      // 移动到指定分组
      for (let item of items.value) {
        if (item.id === targetGroupId) {
          item.items.push(...target.items);
          break;
        }
      }
    }
    // 同步
    await _sync()
  }

  // 保存或更新
  const saveOrUpdate = async (id: string, name: string, itemIds: Array<number>, categoryId: number): Promise<TodoGroup> => {
    // 获取全部的分组
    if (isEmptyString(name)) return Promise.reject(new Error("分组名称不存在"));
    if (items.value.map(e => e.name).includes(name)) return Promise.reject(new Error("分组名称重复"));
    // 修改
    const idx = items.value.findIndex(e => e.id === id);
    let target: TodoGroup;
    if (idx === -1) {
      target = {
        id: useSnowflake().nextId(),
        name,
        categoryId: categoryId,
        sort: items.value.length + 1,
        items: itemIds
      };
      items.value.push(target);
    } else {
      target = {
        ...items.value[idx],
        name
      };
      items.value[idx] = target;
    }
    await _sync()
    return target;
  };


  async function addOneTo(name: string, id: string, categoryId: number, offset: 1 | 0) {
    const arr = toSorted(items.value, (a, b) => a.sort - b.sort);
    const index = arr.findIndex(e => e.id === id);
    const target: TodoGroup = {
      id: useSnowflake().nextId(),
      name,
      categoryId: categoryId,
      sort: 0,
      items: []
    };
    arr.splice(index + offset, 0, target);
    // 重排索引
    for (let i = 0; i < arr.length; i++) {
      arr[i].sort = i;
    }
    items.value = arr;
    await _sync();
  }


  async function sort(order: Array<string>) {
    const itemMap = new Map<string, number>();
    order.forEach((e, i) => itemMap.set(e, i));
    items.value.forEach(e => {
      const idx = itemMap.get(e.id);
      if (idx !== undefined) {
        e.sort = idx;
      } else {
        e.sort = order.length;
      }
    });
    await _sync();
  }

  async function pushTo(group: TodoGroup | string, ...itemIds: Array<number>) {
    const groupId = typeof group === 'string' ? group : group.id;
    if (isEmptyArray(itemIds)) return Promise.resolve();
    for (let i = 0; i < items.value.length; i++) {
      if (items.value[i].id === groupId) {
        items.value[i].items.push(...itemIds);
        break;
      }
    }
    await _sync();
  }

  // 删除一个
  async function popFrom(group: TodoGroup | string, ...itemIds: Array<number>) {
    const groupId = typeof group === 'string' ? group : group.id;
    if (isEmptyArray(itemIds)) return Promise.resolve();
    for (let i = 0; i < items.value.length; i++) {
      if (items.value[i].id === groupId) {
        items.value[i].items = items.value[i].items.filter(e => !itemIds.includes(e));
        break;
      }
    }
    await _sync();
  }

  // 转移一个
  async function moveTo(source: TodoGroup | string, target: TodoGroup | string, ...itemIds: Array<number>) {
    if (isEmptyArray(itemIds)) return Promise.resolve();
    const sourceId = typeof source === 'string' ? source : source.id;
    const targetId = typeof target === 'string' ? target : target.id;
    if (targetId === sourceId) return Promise.resolve();
    for (let i = 0; i < items.value.length; i++) {
      if (items.value[i].id === targetId) {
        items.value[i].items.push(...itemIds);
      }
      if (items.value[i].id === sourceId) {
        items.value[i].items = items.value[i].items.filter(e => !itemIds.includes(e));
      }
    }
    await _sync();
  }

  return {
    items,
    init,
    saveOrUpdate, addOneTo,
    deleteById, sort,
    pushTo, popFrom, moveTo
  }
})