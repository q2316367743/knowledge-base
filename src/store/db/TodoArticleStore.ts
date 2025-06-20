import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {useAsyncDebounce} from "@/hooks/AsyncDebounce";

export const useTodoArticleStore = defineStore('todo-article', () => {
  const items = ref<Array<number>>([]);
  const rev = shallowRef<string>();
  const key = shallowRef('');

  async function init(id: number) {
    items.value = [];
    rev.value = undefined;
    if (id === 0) {
      key.value = '';
      return;
    }
    try {
      key.value = LocalNameEnum.TODO_ARTICLE + id;
      const res = await getFromOneWithDefaultByAsync<Array<number>>(key.value, new Array<number>())
      items.value = res.record;
      rev.value = res.rev;
    } catch (e) {
      key.value = '';
      MessageUtil.info('初始化待办项失败');
    }
  }

  function destroy() {
    items.value = [];
    rev.value = undefined;
    key.value = '';
  }

  const _sync = useAsyncDebounce(async () => {
    rev.value = await saveOneByAsync<Array<number>>(
      key.value,
      items.value,
      rev.value);
  }, 300)

  async function associationArticle(ids: Array<number>) {
    if (isEmptyString(key.value)) {
      return;
    }
    items.value = ids;
    _sync()
  }

  return {
    items, init, destroy, associationArticle
  }
})