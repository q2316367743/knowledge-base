
export function useIntervalComputer<T>(func: () => T, interval: number): ComputedRef<T> {
  const value = ref<T>(func()) as Ref<T>;
  const res = computed(() => value.value);

  let intervalId: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    intervalId = setInterval(() => {
      value.value = func();
    }, interval);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return res;
}