<template>
  <t-popup
    v-model:visible="showPopup"
    placement="bottom"
    :show-arrow="false"
    trigger="click"
  >
    <div class="todo-reminder" v-if="isReminder">
      <div class="reminder-content ellipsis">
        <alarm-icon/>
        <span>{{ reminderText }}</span>
      </div>
    </div>
    <t-button :block="true" v-else>添加提醒</t-button>
    <template #content>
      <div class="reminder-popup">
        <div class="reminder-popup-header">
          <span>设置提醒</span>
        </div>
        <div class="reminder-popup-content">
          <div class="reminder-item">
            <span class="reminder-label">提醒事项</span>
            <t-input v-model="reminderItem" placeholder="请输入提醒事项"/>
          </div>
          <div class="reminder-item">
            <span class="reminder-label">提醒时间</span>
            <t-time-picker
              v-model="remainingTime"
              format="HH:mm:ss"
              :disableTime="disablePastTime"
              placeholder="请选择提醒时间"
              style="width: 180px"
            />
          </div>
        </div>
        <div class="reminder-popup-footer">
          <t-button theme="primary" @click="startReminder" :disabled="disabledStart">开始提醒</t-button>
          <t-button theme="danger" :disabled="!isReminder" @click="stopReminder">停止提醒</t-button>
        </div>
      </div>
    </template>
  </t-popup>
</template>

<script lang="ts" setup>
import {AlarmIcon} from "tdesign-icons-vue-next";
import dayjs from "dayjs";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const fetchTime = () => dayjs().add(1, 'h').format("HH:00");

const showPopup = ref(false);
const isReminder = useUtoolsKvStorage<boolean>(LocalNameEnum.NESTED_TODO_REMINDER_ENABLE, false);
const reminderItem = useUtoolsKvStorage<string>(LocalNameEnum.NESTED_TODO_REMINDER_TEXT, "");
const remainingTime = useUtoolsKvStorage(LocalNameEnum.NESTED_TODO_REMINDER_TIME, fetchTime);
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);

// 提醒文本
const reminderText = ref('');

// 计算是否可以开始提醒
const disabledForm = computed(() => !reminderItem.value || !remainingTime.value)
const disabledStart = computed(() => disabledForm.value || isReminder.value);
const disablePastTime = (h: number): Partial<{
  hour: Array<number>,
  minute: Array<number>,
  second: Array<number>,
  millisecond: Array<number>
}> => {
  // 返回大于当前时间
  const now = dayjs();
  const hour = now.hour();
  const minute = now.minute();
  return {
    hour: Array.from({length: hour}, (_, i) => i),
    minute: Array.from({length: h === hour ? minute : 0}, (_, i) => i),
  };
};

// 开始提醒
function startReminder() {
  if (disabledForm.value) return;

  isReminder.value = true;
  showPopup.value = false;
  updateRemainingTime();

  // 清除之前的定时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  // 设置定时器，每秒更新一次倒计时
  timerInterval.value = setInterval(() => {
    updateRemainingTime();
  }, 1000);
}

// 停止提醒
function stopReminder() {
  isReminder.value = false;

  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

// 更新剩余时间
function updateRemainingTime() {
  const targetTime = dayjs(remainingTime.value, 'HH:mm');
  const diff = targetTime.diff(dayjs(), 'millisecond');

  if (diff <= 0) {
    reminderText.value = "时间到！";
    // 可以在这里添加提醒通知逻辑
    utools.showNotification("时间到！");
    return;
  }

  // 计算剩余时间
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let timeText = "";
  if (days > 0) timeText += `${days}天`;
  if (hours > 0 || days > 0) timeText += `${hours}小时`;
  if (minutes > 0 || hours > 0 || days > 0) timeText += `${minutes}分钟`;
  timeText += `${seconds}秒`;

  reminderText.value = `距离${reminderItem.value}还剩: ${timeText}`;
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
});

// 组件挂载时初始化
onMounted(() => {
  // 从存储中恢复提醒状态的逻辑
  if (isReminder.value) {
    startReminder();
  }
});
</script>

<style scoped lang="less">
.todo-reminder {
  height: 30px;
  width: 100%;
  border: 1px solid var(--td-brand-color-active);
  border-radius: var(--td-radius-default);
  cursor: pointer;
  display: flex;
  align-items: center;

  .reminder-content {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    padding: 0 8px;

    span {
      margin-left: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.reminder-popup {
  background-color: var(--td-bg-color-container);
  padding: 16px;
  width: 180px;

  &-header {
    font-weight: bold;
    margin-bottom: 16px;
    font-size: 16px;
  }

  &-content {
    margin-bottom: 16px;

    .reminder-item {
      margin-bottom: 12px;

      .reminder-label {
        display: block;
        margin-bottom: 4px;
      }
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
}
</style>
