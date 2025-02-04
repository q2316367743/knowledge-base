import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";

export interface UseCurdStorageEntry<ID extends number | string> {
  id: ID;

  [key: string]: any
}

export interface UseCurdStorageProps {
  key: string;
}

export interface UseCurdStorageReturn<T, ID extends number | string> {
  items: Ref<Array<T>>;
  init: (props: UseCurdStorageProps) => Promise<void>;
  add: (item: T & UseCurdStorageEntry<ID>) => Promise<void>;
  updateById: (id: ID, item: Partial<T & UseCurdStorageEntry<ID>>) => Promise<void>;
  deleteById: (id: ID) => Promise<void>;
}

export function useCurdStorage<T, ID extends number | string>(props?: UseCurdStorageProps): UseCurdStorageReturn<T,ID> {
  const items: Ref<Array<T & UseCurdStorageEntry<ID>>> = ref(new Array<any>());
  const rev = ref<string>();
  let key = props?.key || '';


  async function init(prop?: UseCurdStorageProps) {
    if (prop) {
      key = prop.key;
    }
    // 清空
    items.value = [];
    rev.value = undefined;

    try {
      const res = await listByAsync<T & UseCurdStorageEntry<ID>>(key);
      items.value = res.list;
      rev.value = res.rev;
    } catch (e) {
      console.error(e);
    }
  }

  async function _sync() {
    rev.value = await saveListByAsync(key, items.value, rev.value);
  }

  async function add(item: T & UseCurdStorageEntry<ID>) {
    // 添加
    items.value.push(item);
    // 同步
    await _sync()
  }

  async function updateById(id: ID, item: Partial<T & UseCurdStorageEntry<ID>>) {
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

  async function deleteById(id: ID) {
    // 删除
    const index = items.value.findIndex(e => e.id === id);
    if (index === -1) {
      return;
    }
    items.value.splice(index, 1);
    // 同步
    await _sync()
  }

  return {
    items,
    init,
    add,
    updateById,
    deleteById,
  }


}