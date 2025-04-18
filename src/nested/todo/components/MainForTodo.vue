<template>
  <div class="todo-container">
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
    <!-- 周视图导航 -->
    <week-navigator v-model="currentDay" :week-days-has-todo="weekDaysHasTodo" @update="updateDaysTodoStatus"/>
    <!-- 待办列表 -->
    <day-of-todo :today-items="todayItems" @update="updateTodayItems"/>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import MessageUtil from "@/utils/modal/MessageUtil";
import {themeColor, useTodoItemStore} from "@/store";
import {TodoItem} from '@/entity/todo/TodoItem';
import WeekNavigator from "@/nested/todo/components/WeekNavigator.vue";
import DayOfTodo from "@/nested/todo/components/DayOfTodo.vue";

// 获取待办项
const todoStore = useTodoItemStore();
const items = computed<{ id: number }[]>(() => todoStore.items);

const props = defineProps({
  todoId: {
    type: Number,
    default: 0
  }
});


// 日期相关
const currentDay = ref(dayjs().format('YYYY-MM-DD'));
const weekStart = ref(dayjs().startOf('week'));
// 存储每天是否有待办的状态
const weekDaysHasTodo = ref<Record<string, boolean>>({});


// 更新每天是否有待办的状态
const updateDaysTodoStatus = async () => {
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

  // 检查每个待办项是否在当前周的某一天
  for (const item of items.value) {
    try {
      const todoItem = await todoStore.getTodoItem(item.id);
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

// 获取当天的待办项
const todayItems = ref<TodoItem[]>([]);

// 监听当前日期变化，更新待办列表
watch([currentDay, items], async () => {
  await updateTodayItems();
  await updateDaysTodoStatus();
}, {immediate: true});

async function updateTodayItems(): Promise<void> {
  const selectedDate = dayjs(currentDay.value);
  const startOfDay = selectedDate.startOf('day').valueOf();
  const endOfDay = selectedDate.endOf('day').valueOf();

  const todayTodoItems: TodoItem[] = [];

  for (const item of items.value) {
    try {
      const todoItem = await todoStore.getTodoItem(item.id);
      const startTime = todoItem.attr.start ? new Date(todoItem.attr.start).getTime() : todoItem.index.id;
      const endTime = todoItem.attr.end ? new Date(todoItem.attr.end).getTime() : startTime;

      // 判断待办项是否在当天范围内
      if ((startTime <= endOfDay && endTime >= startOfDay)) {
        todayTodoItems.push(todoItem);
      }
    } catch (e) {
      console.error('获取待办项详情失败', e);
    }
  }

  todayTodoItems.sort((a, b) => (b.index.top ? 1 : 0) - (a.index.top ? 1 : 0))

  todayItems.value = todayTodoItems;
}


// 初始加载
onMounted(() => {
  todoStore.init(props.todoId)
    .then(async () => {
      await updateTodayItems();
      await updateDaysTodoStatus();
    })
    .catch(e => MessageUtil.error("打开待办失败", e));
});

</script>

<style scoped lang="less">
.todo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-l);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--td-comp-margin-m);
}


</style>
