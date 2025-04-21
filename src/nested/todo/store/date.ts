import {useTodoItemStore} from "@/store";
import dayjs from "dayjs";
import {WeekDayItem} from "@/nested/todo/types";


// 日期相关
export const currentDay = ref<string>(dayjs().format('YYYY-MM-DD'));
export const weekStart = ref(dayjs().startOf('week'));

// 存储每天是否有待办的状态
const weekDaysHasTodo = ref<Record<string, boolean>>({});

// 更新每天是否有待办的状态
export const updateDaysTodoStatus = async () => {
  const newHasTodoMap: Record<string, boolean> = {};

  // 先获取当前周的所有日期
  const currentWeekDates = [];
  for (let i = 0; i < 7; i++) {
    currentWeekDates.push(weekStart.value.add(i, 'day').format('YYYY-MM-DD'));
  }

  // 初始化所有日期的待办状态为false
  for (const date of currentWeekDates) {
    newHasTodoMap[date] = false;
  }

  const {items} = useTodoItemStore();

  // 检查每个待办项是否在当前周的某一天
  for (const item of items) {
    try {
      const todoItem = await useTodoItemStore().getTodoItem(item.id);
      const startTime = todoItem.attr.start ? new Date(todoItem.attr.start).getTime() : todoItem.index.id;
      const endTime = todoItem.attr.end ? new Date(todoItem.attr.end).getTime() : startTime;

      for (const date of currentWeekDates) {
        const dayDate = dayjs(date);
        const startOfDay = dayDate.startOf('day').valueOf();
        const endOfDay = dayDate.endOf('day').valueOf();

        // 判断待办项是否在当天范围内
        if (startTime <= endOfDay && endTime >= startOfDay) {
          newHasTodoMap[date] = true;
        }
      }
    } catch (e) {
      console.error('获取待办项详情失败', e);
    }
  }

  // 更新响应式引用，触发计算属性重新计算
  weekDaysHasTodo.value = newHasTodoMap;
};

// 生成一周的日期
export const weekDays = computed<WeekDayItem[]>(() => {
  const days: WeekDayItem[] = [];
  for (let i = 0; i < 7; i++) {
    const day = weekStart.value.add(i, 'day');
    const date = day.format('YYYY-MM-DD');
    days.push({
      date,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day.day()],
      dateStr: day.format('MM-DD'),
      hasTodo: weekDaysHasTodo.value[date] || false
    });
  }
  return days;
});


export function prevWeek() {
  weekStart.value = weekStart.value.subtract(7, 'day');
}

export function nextWeek() {
  weekStart.value = weekStart.value.add(7, 'day');
}

export function selectDay(date: string) {
  currentDay.value = date;
}