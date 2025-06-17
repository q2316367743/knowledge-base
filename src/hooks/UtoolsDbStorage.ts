import {ref, Ref, shallowRef, toRaw, watch} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getItem, removeItem, setItem} from "@/utils/utools/DbStorageUtil";

export interface UseUtoolsDbOptions {
  flush?: 'pre' | 'post' | 'sync';
  deep?: boolean;
  shallow?: boolean;

  onError?(e: any): void;
}

type InitialValueFunc<T> = () => T
type InitialValue<T> = T | InitialValueFunc<T>


/**
 * 同步对象存储
 */
export function useUtoolsDbStorage<T extends (string | number | boolean | object | null)>(
  key: string,
  initial: InitialValue<T>,
  options: UseUtoolsDbOptions = {},
): Ref<T> {
  const {
    flush = 'pre',
    deep = true,
    shallow,
    onError = (e) => {
      MessageUtil.error('数据保存失败', e)
    },
  } = options

  const sourceValue = getItem(key);
  const initialFunc: InitialValueFunc<T> = typeof initial === 'function' ? (initial as InitialValueFunc<T>) : (() => initial);
  const data = (shallow ? shallowRef : ref)((typeof sourceValue === 'undefined' || sourceValue === null) ? initialFunc() : sourceValue) as Ref<T>;

  watch(
    data,
    () => {
      try {
        if (data.value == null)
          removeItem(key)
        else
          setItem(key, toRaw(data.value))
      } catch (e) {
        onError(e)
      }
    },
    {
      flush,
      deep,
    },
  )

  return data as Ref<T>
}

