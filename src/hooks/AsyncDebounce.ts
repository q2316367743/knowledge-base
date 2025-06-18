/**
 * 异步防抖函数
 * @param fn 需要防抖的异步函数
 * @param delay 延迟时间
 */
export const useAsyncDebounce = (fn: () => Promise<void>, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let loading = false;
  let laster = false;

  const func = (): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (loading) {
        laster = true;
        return;
      }
      loading = true;
      fn().finally(() => {
        loading = false;
        if (laster) {
          laster = false;
          func();
        }
      });
    }, delay);
  }
  return func;
}