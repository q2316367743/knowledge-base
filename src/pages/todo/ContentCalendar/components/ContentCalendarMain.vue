<template>
  <div class="content-calendar-main">
    <div class="calendar-header">
      <div class="header-left">
        <t-space>
          <t-button @click="prevMonth" variant="outline">
            上一月
          </t-button>
          <t-button @click="nextMonth" variant="outline">
            下一月
          </t-button>
        </t-space>
      </div>
      <div class="header-center">
        <span class="current-date">{{ currentYearMonth }}</span>
      </div>
      <div class="header-right">
        <t-space>
          <t-button variant="outline" @click="handleAdd()">
            新建日程
          </t-button>
          <t-button @click="backToToday" variant="outline" :disabled="isCurrentMonth">
            返回今天
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
            'selected': selectedDate && isSameDay(day.date, selectedDate)
          }"
          @click="handleDayClick(day)"
        >
          <div class="day-header">{{ day.dayOfMonth }}</div>
          <div class="todo-items">
            <div
              v-for="todo in day.todoItems"
              :key="todo.index.id"
              class="todo-item"
              :class="{ 'multi-day': todo.isMultiDay }"
              @click.stop="openTodoItemSetting(todo.index)"
              @contextmenu="onContextMenuForTodo($event, todo.index)"
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
import {TodoItem} from "@/entity/todo/TodoItem";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";
import {onContextMenuForTodo} from "@/pages/todo/common/ContextMenuForTodo";

interface CalendarDay {
  date: Date;
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

onMounted(async () => {
  todoItems.value = await getRecords();
});

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
    days.push({
      date: new Date(year, month - 1, prevMonth.getDate() - i),
      dayOfMonth: prevMonth.getDate() - i,
      currentMonth: false,
      isToday: false,
      todoItems: []
    });
  }

  // 添加当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      dayOfMonth: i,
      currentMonth: true,
      isToday: isSameDay(new Date(year, month, i), new Date()),
      todoItems: []
    });
  }

  // 添加下个月的日期
  const remainingDays = 42 - days.length; // 6行7列的日历格子
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      dayOfMonth: i,
      currentMonth: false,
      isToday: false,
      todoItems: []
    });
  }

  // 将待办事项添加到对应的日期
  for (const item of todoItems.value) {
    if (item.attr?.start) {
      const startDate = new Date(item.attr.start);
      const endDate = item.attr.end ? new Date(item.attr.end) : startDate;

      for (const day of days) {
        if (day.date >= startDate && day.date <= endDate) {
          day.todoItems.push({
            ...item,
            isMultiDay: !!item.attr.end && item.attr.start !== item.attr.end
          });
        }
      }
    }
  }

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

const handleAdd = () => openAddTodoItem()

const selectedDate = ref<Date | null>(null);

const handleDayClick = (day: CalendarDay) => {
  selectedDate.value = day.date;
};
</script>

<style scoped lang="less">
.content-calendar-main {
  height: calc(100% - 54px);
  display: flex;
  flex-direction: column;
  padding: 0 8px 8px;

  .calendar-header {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-center {
      flex: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;

      .current-date {
        font-size: var(--td-font-size-headline-medium);
        font-weight: bold;
      }
    }
  }

  .calendar-grid {
    flex: 1;
    display: flex;
    flex-direction: column;
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


        &.today {
          .day-header {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            color: var(--td-text-color-anti);
            border: 2px solid var(--td-text-color-primary);
            background-color: var(--td-text-color-primary);
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

    .day-header {
      margin-bottom: 4px;
    }

    .todo-items {
      flex: 1;
      overflow-y: auto;

      .todo-item {
        font-size: 12px;
        padding: 2px 4px;
        margin-bottom: 2px;
        background-color: var(--td-brand-color-active);
        border-radius: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &.multi-day {
          background-color: var(--td-brand-color-2);
        }
      }
    }
  }
}
</style>