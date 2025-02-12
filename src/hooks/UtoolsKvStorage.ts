import {getItem, setItem} from "@/utils/utools/DbStorageUtil";
import {isNull} from "@/utils/lang/FieldUtil";

/**
 * uTools键值存储
 */
export function useUtoolsKvStorage<T extends string | number | boolean>(
  key: string,
  initialValue: T
): Ref<T> {
  const db = getItem<T>(key);
  let source: T
  if (isNull(db)) {
    setItem<T>(key, initialValue)
    source = initialValue
  } else {
    source = db!;
  }
  return customRef<T>((track, trigger) => ({
    get(): T {
      track()
      return source;
    },
    set(value) {
      source = value;
      setItem<T>(key, toRaw(value));
      trigger()
    }
  }))
}
