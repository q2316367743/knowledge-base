<template>
  <div class="todo-focus" v-if="isFocus">
    <t-popup
      v-model:visible="visible"
      trigger="click"
      placement="bottom"
      :show-arrow="true"
      :destroy-on-close="false"
    >
      <template #content>
        <div class="focus-time-popup">
          <t-row :gutter="[8,8]">
            <t-col :span="6">
              <t-button size="small" @click="setFocusTime(5)">5 分钟</t-button>
            </t-col>
            <t-col :span="6">
              <t-button size="small" @click="setFocusTime(15)">15分钟</t-button>
            </t-col>
            <t-col :span="6">
              <t-button size="small" @click="setFocusTime(25)">25分钟</t-button>
            </t-col>
            <t-col :span="6">
              <t-button size="small" @click="setFocusTime(30)">30分钟</t-button>
            </t-col>
            <t-col :span="6">
              <t-button size="small" @click="setFocusTime(40)">40分钟</t-button>
            </t-col>
            <t-col :span="6">
              <t-button size="small" @click="setFocusTime(60)">60分钟</t-button>
            </t-col>
            <t-col :span="12">
              <t-space size="small" align="center">
                <t-input-number
                  size="small"
                  :min="1"
                  :max="120"
                  theme="normal"
                  style="width: 72px"
                  v-model="customMinutes"
                  suffix="分钟"
                />
                <t-button size="small" theme="primary" @click="applyCustomTime">确定</t-button>
              </t-space>
            </t-col>
          </t-row>
        </div>
      </template>
      <div class="focus-container">
        <div class="focus-progress-container">
          <div class="focus-progress-wave" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <div class="focus-time">{{ formatTime(remainingTime) }}</div>
        <div class="focus-stop">
          <t-button theme="danger" shape="circle" size="small" @click.stop="stopFocus">
            <template #icon>
              <stop-icon/>
            </template>
          </t-button>
        </div>
      </div>
    </t-popup>
  </div>
  <t-button :block="true" v-else @click="startFocus">开始专注</t-button>
</template>

<script lang="ts" setup>
import {StopIcon} from 'tdesign-icons-vue-next'
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsKvStorage} from '@/hooks/UtoolsKvStorage';

const visible = ref(false);
const isFocus = ref(false)
const totalTime = ref(25 * 60) // 默认25分钟，单位：秒
const remainingTime = ref(totalTime.value)
const timerId = ref<number | null>(null);
const customMinutes = useUtoolsKvStorage(LocalNameEnum.NESTED_TODO_FOCUS_TIME, 25);

const progressPercentage = computed(() => {
  return 100 - (remainingTime.value / totalTime.value) * 100
})

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startFocus = () => {
  isFocus.value = true
  remainingTime.value = totalTime.value
  timerId.value = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      stopFocus()
    }
  }, 1000);
  visible.value = false;
}

const stopFocus = () => {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
  isFocus.value = false
}

const setFocusTime = (minutes: number) => {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }

  totalTime.value = minutes * 60
  remainingTime.value = totalTime.value

  // 重新启动计时器
  timerId.value = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      stopFocus()
    }
  }, 1000);

  visible.value = false;
}

const applyCustomTime = () => {
  setFocusTime(customMinutes.value)
}


onUnmounted(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
})
</script>

<style scoped lang="less">
.todo-focus {
  width: 100%;
}

.focus-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
  overflow: hidden;
  cursor: pointer;

  .focus-progress-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .focus-progress-wave {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--td-brand-color);
    opacity: 0.2;
    transition: width 1s linear;
    z-index: 0;

    &::before, &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 10px;
      background: var(--td-brand-color);
      animation: wave 2s infinite linear;
    }

    &::after {
      animation-delay: 1s;
      opacity: 0.6;
    }
  }

  .focus-time {
    flex: 1;
    text-align: center;
    font-weight: bold;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 32px;
  }

  .focus-stop {
    margin-right: 4px;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    padding-top: 4px;
  }

}

.focus-time-popup {
  padding: 6px;
  width: 120px;
}


@keyframes wave {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>
