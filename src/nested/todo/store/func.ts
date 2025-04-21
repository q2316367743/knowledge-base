import dayjs from "dayjs";
import {useTodoWrapStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {currentDay, loading, updateDaysTodoStatus, updateTodayItems} from "@/nested/todo/store";
import {weekStart} from "@/nested/todo/store/date";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";

// 监听当前日期变化，更新待办列表
watch([currentDay], () => updateTodayItems());
watch([weekStart, currentDay], updateDaysTodoStatus);

export function initTodo(todoId: number): void {
  (async () => {
    try {
      await useTodoCategoryStore().init();
      await useTodoWrapStore().init(todoId);
      loading.value = false;
      await updateTodayItems();
      await updateDaysTodoStatus();
    } catch (e) {
      MessageUtil.error("打开待办失败", e)
    }
  })();
}

export function backToToday() {
  currentDay.value = dayjs().format('YYYY-MM-DD');
  weekStart.value = dayjs().startOf('week');
}

export function refresh() {
  Promise.all([updateTodayItems(), updateDaysTodoStatus()])
    .catch(e => MessageUtil.error("刷新失败", e));
}