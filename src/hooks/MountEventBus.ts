import {EventBusListener, UseEventBusReturn} from "@vueuse/core";

/**
 * 挂载时注册，取消挂载去除
 *
 * @param event 事件
 * @param callback 回掉方法
 */
export function useMountEventBus<T, P>(event: UseEventBusReturn<T, P>, callback: EventBusListener<T, P>) {
  onMounted(() => {
    event.on(callback);
  });
  onBeforeUnmount(() => {
    event.off(callback);
  })
}