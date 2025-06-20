import {listToTree, TodoCategory, TodoCategoryRecord, TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import {defineStore} from "pinia";
import {listByAsync, removeOneByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/lang/ArrayUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoWrapStore} from "@/store";
import {UToolsUtil} from "@/utils/utools/UToolsUtil";
import {useAsyncDebounce} from "@/hooks/AsyncDebounce";

export const useTodoCategoryStore = defineStore('todo-category', () => {
  const state = ref(new Array<TodoCategory>());
  const rev = ref<string>();
  const featureKeys = ref(new Set<string>());

  const todoCategoryTree = computed(() => listToTree(state.value));
  const todoCategoryMap = computed(() => map<TodoCategory, number, 'id'>(state.value, 'id'));

  async function init() {
    const res = await listByAsync<TodoCategory>(LocalNameEnum.LOCAL_TODO_CATEGORY);
    state.value = res.list;
    rev.value = res.rev;
    featureKeys.value = new Set<string>(UToolsUtil.feature.listFeature(Constant.feature.TODO_CATEGORY, state.value.map(r => r.id)));
  }

  const _sync = useAsyncDebounce(async () => {
    rev.value = await saveListByAsync(LocalNameEnum.LOCAL_TODO_CATEGORY, state.value, rev.value);
    featureKeys.value = new Set<string>(UToolsUtil.feature.listFeature(Constant.feature.TODO_CATEGORY, state.value.map(r => r.id)));
  }, 300);

  async function add(record: TodoCategoryRecord) {
    const now = new Date();
    const id = now.getTime();
    state.value.push({
      ...record,
      id: id,
      createTime: now,
      updateTime: now
    });
    _sync();
  }

  async function update(id: number, source: Partial<TodoCategory>) {
    const index = state.value.findIndex(v => v.id === id);
    if (index === -1) {
      return Promise.reject("该分类不存在");
    }
    state.value[index] = {
      ...state.value[index],
      ...source,
      updateTime: new Date()
    }
    _sync();
  }

  function rename(id: number, newName: string) {
    return update(id, {name: newName});
  }

  function hasFeature(id: number) {
    return featureKeys.value.has(Constant.feature.TODO_CATEGORY + id);
  }

  function addFeature(id: number) {
    const index = state.value.findIndex(v => v.id === id);
    if (index === -1) {
      MessageUtil.error("该分类不存在");
      return;
    }
    const feature = Constant.feature.TODO_CATEGORY + id;
    UToolsUtil.feature.setFeatureOneSimple(feature, state.value[index].name);
    featureKeys.value.add(feature);
  }

  function removeFeature(id: number) {
    const feature = Constant.feature.TODO_CATEGORY + id;
    UToolsUtil.feature.removeFeatureOne(feature);
    featureKeys.value.delete(feature);
  }

  async function remove(id: number) {
    const index = state.value.findIndex(v => v.id === id);
    if (index === -1) {
      return Promise.reject("该分类不存在");
    }
    // 看看这个下面有没有子分类
    const sub = state.value.findIndex(v => v.pid === id);
    if (sub > -1) {
      return Promise.reject("该文件夹下存在其他清单，请删除全部清单后再删除此文件夹");
    }
    // 删除
    let splice = state.value.splice(index, 1);
    _sync();
    // 如果是清单，还要删除待办
    if (splice[0].type === TodoCategoryTypeEnum.TODO) {
      const items = await listByAsync<TodoItemIndex>(LocalNameEnum.TODO_CATEGORY + id);
      for (let item of items.list) {
        // 删除内容
        await removeOneByAsync(LocalNameEnum.TODO_ITEM + item.id, true);
      }
      // 删除列表
      await removeOneByAsync(LocalNameEnum.TODO_CATEGORY + id, true);
    }
    if (useTodoWrapStore().categoryId === id) {
      await useTodoWrapStore().init(0);
    }
    // 删除快捷访问
    if (hasFeature(id)) {
      removeFeature(id);
    }
  }

  async function drop(id: number, pid: number) {
    const index = state.value.findIndex(v => v.id === id);
    if (index === -1) {
      return Promise.reject("待办分类不存在");
    }
    state.value[index] = {
      ...state.value[index],
      pid: pid,
      updateTime: new Date()
    }
    _sync();
  }

  return {
    featureKeys, todoCategoryMap, todoCategoryTree,
    init, add, update, remove, drop, rename, hasFeature, addFeature, removeFeature
  }

})