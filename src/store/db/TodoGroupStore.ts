import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {TodoGroup} from "@/entity/todo/TodoGroup";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {isEmptyString} from "@/utils/lang/StringUtil";
import {useSnowflake} from "@/hooks/Snowflake";
import {useTodoItemStore} from "@/store/db/TodoItemStore";

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
    }else if (targetGroupId !== '0') {
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

  return {
    items,
    init,
    saveOrUpdate,
    deleteById,
  }
})