<template>
  <div class="week-navigator">
    <div class="nav-arrows">
      <t-button variant="text" shape="square" @click="prevWeek">
        <template #icon>
          <chevron-left-icon/>
        </template>
      </t-button>
    </div>

    <div class="week-days">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="day-item"
        :class="{ 'active': day.date === currentDay }"
        @click="selectDay(day.date)"
      >
        <div class="weekday">{{ day.weekday }}</div>
        <div class="date">{{ day.dateStr }}</div>
        <div class="todo-dot" v-if="day.hasTodo"></div>
        <div class="indicator" v-if="day.date === currentDay"></div>
      </div>
    </div>

    <div class="nav-arrows">
      <t-button variant="text" shape="square" @click="nextWeek">
        <template #icon>
          <chevron-right-icon/>
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import {ChevronLeftIcon, ChevronRightIcon} from "tdesign-icons-vue-next";
import {WeekDayItem} from "@/nested/todo/types";

const currentDay = defineModel({
  type: String,
  default: () => dayjs().format('YYYY-MM-DD')
});

const props = defineProps({
  weekDaysHasTodo: {
    type: Object as PropType<Record<string, boolean>>,
    default: () => ({})
  }
});

const emit = defineEmits(['update']);

const weekStart = ref(dayjs().startOf('week'));

// 生成一周的日期
const weekDays = computed<WeekDayItem[]>(() => {
  const days: WeekDayItem[] = [];
  for (let i = 0; i < 7; i++) {
    const day = weekStart.value.add(i, 'day');
    const date = day.format('YYYY-MM-DD');
    days.push({
      date,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day.day()],
      dateStr: day.format('MM-DD'),
      hasTodo: props.weekDaysHasTodo[date] || false
    });
  }
  return days;
});

function prevWeek() {
  weekStart.value = weekStart.value.subtract(7, 'day');
  emit('update');
}

function nextWeek() {
  weekStart.value = weekStart.value.add(7, 'day');
  emit('update');
}

function selectDay(date: string) {
  currentDay.value = date;
}
</script>
<style scoped lang="less">
.week-navigator {
  display: flex;
  align-items: center;
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  padding: 8px 0;
  margin-bottom: 16px;
  box-shadow: var(--td-shadow-1);

  .week-days {
    display: flex;
    flex: 1;
    justify-content: space-between;

    .day-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      position: relative;
      border-radius: var(--td-radius-medium);

      &.active {
        background-color: var(--td-brand-color-1);
        font-weight: bold;
        color: var(--td-brand-color);

        .indicator {
          position: absolute;
          bottom: 0;
          width: 16px;
          height: 3px;
          background-color: var(--td-brand-color);
          border-radius: var(--td-radius-small);
        }
      }

      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }


      .weekday {
        font-size: var(--td-font-size-body-small);
        margin-bottom: 4px;
      }

      .date {
        font-size: 10px;
      }

      .todo-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--td-brand-color);
      }
    }

  }

}
</style>
