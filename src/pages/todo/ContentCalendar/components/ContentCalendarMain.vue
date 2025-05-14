<template>
  <div class="content-calendar-main">
    <div class="calendar-header">
      <div class="header-center">
        <span class="current-date">{{ currentYearMonth }}</span>
      </div>
      <div class="header-left">
        <t-button variant="outline" @click="handleAdd()">
          新建日程
        </t-button>
      </div>
      <div class="header-right">
        <t-space size="small">
          <t-button variant="outline" @click="onCancel" v-if="selectedDates.length > 0">
            取消选择
          </t-button>
          <t-button @click="backToToday" variant="outline" :disabled="isCurrentMonth">
            回到本月
          </t-button>
          <t-button @click="prevMonth" variant="outline" shape="square">
            <template #icon>
              <chevron-left-icon/>
            </template>
          </t-button>
          <t-button @click="nextMonth" variant="outline" shape="square">
            <template #icon>
              <chevron-right-icon/>
            </template>
          </t-button>
        </t-space>
      </div>
    </div>
    <div class="calendar-grid">
      <div class="calendar-weekdays">
        <div v-for="day in weekDays" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>
      <div class="calendar-days">
        <div
          v-for="day in calendarDays"
          class="day"
          :class="{
            'current-month': day.currentMonth,
            'other-month': !day.currentMonth,
            'today': day.isToday,
            'selected': selectedDates.includes(day.day)
          }"
          @mousedown="handleMouseDown(day)"
          @mousemove="handleMouseMove(day)"
          @mouseup="handleMouseUp(day)"
          @mouseleave="handleMouseUp()"
          @contextmenu="openContextMenuForDay($event, day.date)"
        >
          <div class="day-header">
            <div class="day-number">{{ day.dayOfMonth }}</div>
            <t-tooltip content="查看更多" v-if="day.todoItems.length > 2">
              <t-button theme="primary" variant="text" shape="square" size="small" @click.stop>
                <template #icon>
                  <more-icon/>
                </template>
              </t-button>
            </t-tooltip>
          </div>
          <div class="todo-items">
            <div
              v-for="todo in day.todoItems"
              :key="todo.index.id"
              class="todo-item"
              :class="{
                'multi-day': todo.isMultiDay,
                'complete': todo.index.status === TodoItemStatus.COMPLETE,
                'abandon': todo.index.status === TodoItemStatus.ABANDON
              }"
              @click.stop="openTodoItemSetting(todo.index, () => toUpdate())"
              @mousedown.stop
              @contextmenu.stop="onContextMenuForTodo($event, todo.index, () => toUpdate())"
              :style="{borderColor: handlePriorityColor(todo.index.priority, todo.index.status)}"
            >
              {{ todo.index.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useTodoItemStore} from "@/store";
import {handlePriorityColor, TodoItem, TodoItemStatus, todoItemStatusSort} from "@/entity/todo/TodoItem";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {onContextMenuForTodo} from "@/pages/todo/common/ContextMenuForTodo";
import {openContextMenuForDay} from "@/pages/todo/ContentCalendar/components/ContextMenuForDay";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";
import {ChevronLeftIcon, ChevronRightIcon, MoreIcon} from "tdesign-icons-vue-next";
import dayjs from "dayjs";
import {toDayOfBegin, toDayOfEnd} from "@/utils/lang/FieldUtil";
import {toDateTimeString} from "@/utils/lang/FormatUtil";

interface CalendarDay {
  date: Date;
  day: string;
  dayOfMonth: number;
  currentMonth: boolean;
  isToday: boolean;
  todoItems: Array<TodoItem & { isMultiDay?: boolean }>;
}

const getRecords = async (): Promise<Array<TodoItem>> => {
  const {items, getTodoItem} = useTodoItemStore();
  const l = new Array<TodoItem>();
  for (const item of items) {
    l.push(await getTodoItem(item.id));
  }
  return l;
}

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

const currentDate = ref(new Date());
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const currentYearMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  return `${year}年${month}月`;
});
const todoItems = ref<TodoItem[]>([]);

const toUpdate = async () => todoItems.value = await getRecords();

onMounted(toUpdate);

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = new Array<CalendarDay>();

  // 添加上个月的日期
  const prevMonthDays = firstDay.getDay();
  const prevMonth = new Date(year, month, 0);
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonth.getDate() - i);
    days.push({
      date,
      day: dayjs(date).format("YYYY-MM-DD"),
      dayOfMonth: prevMonth.getDate() - i,
      currentMonth: false,
      isToday: false,
      todoItems: []
    });
  }

  // 添加当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      day: dayjs(date).format("YYYY-MM-DD"),
      dayOfMonth: i,
      currentMonth: true,
      isToday: isSameDay(new Date(year, month, i), new Date()),
      todoItems: []
    });
  }

  // 添加下个月的日期
  const remainingDays = 42 - days.length; // 6行7列的日历格子
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      day: dayjs(date).format("YYYY-MM-DD"),
      dayOfMonth: i,
      currentMonth: false,
      isToday: false,
      todoItems: []
    });
  }

  // 将待办事项添加到对应的日期
  for (const item of todoItems.value) {
    const startDate = toDayOfBegin(dayjs(new Date(item.attr.start || item.index.id)));
    const endDate = toDayOfEnd(dayjs(item.attr.end ? new Date(item.attr.end) : startDate));

    for (const day of days) {
      if ((startDate.isBefore(day.date) || startDate.isSame(day.date)) && (endDate.isAfter(day.date) || endDate.isSame(day.date))) {
        day.todoItems.push({
          ...item,
          isMultiDay: !!item.attr.end && item.attr.start !== item.attr.end
        });
      }
    }
  }
  days.forEach(day => {
    day.todoItems.sort((a, b) => todoItemStatusSort(a.index.status, b.index.status));
  })

  return days;
});

const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const backToToday = () => {
  currentDate.value = new Date();
};

const isCurrentMonth = computed(() => {
  const now = new Date();
  return currentDate.value.getFullYear() === now.getFullYear() &&
    currentDate.value.getMonth() === now.getMonth();
});

const isSelecting = ref(false);
const startSelectDate = ref<Date[]>([]);

const selectedDates = computed<Array<string>>(() => {
  if (startSelectDate.value.length === 0) return [];
  const start = startSelectDate.value[0];
  const end = startSelectDate.value[1] || startSelectDate.value[0];
  // 返回开始日期到结束日期中间的日期
  const dates = new Array<string>();

  // 确保开始日期在结束日期之前
  const [minDate, maxDate] = start <= end ? [start, end] : [end, start];

  // 生成从开始到结束的所有日期
  let currentDate = dayjs(minDate);
  while (currentDate.isBefore(maxDate) || currentDate.isSame(maxDate)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, 'day');
  }


  return dates;
});

const onCancel = () => (startSelectDate.value = []);

const handleMouseDown = (day: CalendarDay) => {
  startSelectDate.value = [day.date];
  isSelecting.value = true;
};

const handleMouseMove = (day: CalendarDay) => {
  if (!isSelecting.value) return;

  // 在鼠标移动时只记录当前日期，但不更新选择范围
  // 这样可以在视觉上提供反馈，但实际选择只在鼠标抬起时确定
  startSelectDate.value[1] = day.date;
};

const handleMouseUp = (day?: CalendarDay) => {
  if (isSelecting.value) {
    if (day) {
      startSelectDate.value[1] = day.date;
      isSelecting.value = false;
    }
  }
}
const handleAdd = () => openAddTodoItem({onAdd: () => toUpdate(), start: toDateTimeString(Date.now())})
</script>
<style scoped lang="less">
.content-calendar-main {
  height: calc(100% - 54px);
  display: flex;
  flex-direction: column;
  user-select: none;

  .calendar-header {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;


    .current-date {
      font-size: var(--td-font-size-title-medium);
      font-weight: bold;
    }


    .header-center {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      align-items: center;
      text-align: center;
      line-height: 48px;
    }
  }

  .calendar-grid {
    position: absolute;
    top: 56px;
    left: 8px;
    right: 8px;
    bottom: 8px;


    border: 1px solid var(--td-component-border);
    border-radius: var(--td-radius-medium);

    .calendar-weekdays {

      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      border-bottom: 1px solid var(--td-component-border);

      .weekday {
        padding: 8px;
        font-weight: bold;
      }
    }

    .calendar-days {
      position: absolute;
      top: 39px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: auto;

      flex: 1;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(6, 1fr);

      .day {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid var(--td-component-border);
        border-right: 1px solid var(--td-component-border);
        transition: background-color 0.3s;

        &:nth-child(7n) {
          border-right: none;
        }

        &:nth-last-child(-n+7) {
          border-bottom: none;
        }

        &.current-month {
          color: var(--td-text-color-primary);
        }

        &.other-month {
          color: var(--td-text-color-disabled);
        }

        .day-header {
          display: flex;
          justify-content: space-between;
        }


        &.today {
          .day-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            color: var(--td-text-color-anti);
            background-color: #367fb5;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
        }

        &.selected {
          background-color: var(--td-brand-color-1);
        }
      }
    }
  }
}

.calendar-days {
  .day {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 80px;


    .day-header {
      margin-bottom: 4px;
    }

    .todo-items {
      flex: 1;
      overflow-y: auto;
      max-height: 80px;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--td-component-border);
        border-radius: 4px;
      }

      .todo-item {
        position: relative;
        font-size: 12px;
        padding: 2px 4px;
        margin-bottom: 2px;
        background-color: #7da9ca;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        transition: background-color 0.3s;
        border-left: 6px solid var(--td-border-level-2-color);
        border-radius: 4px 2px 2px 4px;
        color: var(--td-text-color-anti);

        &.complete, &.abandon {
          background-color: var(--td-bg-color-component-disabled);
          color: var(--td-text-color-disabled);
          text-decoration: line-through;

          &:hover {
            background-color: var(--td-bg-color-component-disabled);
          }
        }


        &:hover {
          background-color: #367fb5;
        }
      }
    }
  }
}

.todo-card {

  .todo-card__header {
    font-size: var(--td-font-size-title-medium);
    font-weight: bold;
    padding: 8px;
  }

  .todo-card__content {
    border-top: 1px solid var(--td-border-level-2-color);
    padding-top: 8px;
  }
}
</style>