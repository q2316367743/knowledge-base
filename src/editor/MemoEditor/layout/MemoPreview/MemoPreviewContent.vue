<template>
  <div class="memo-preview-content">
    <div class="memo-preview-content__header">
      <t-button theme="primary" @click="preCard">
        <template #icon>
          <chevron-left-icon/>
        </template>
      </t-button>
      <div class="progress">{{ idx + 1 }} / {{ cards.length }}</div>
      <t-button theme="primary" @click="nexCard">
        <template #icon>
          <chevron-right-icon/>
        </template>
      </t-button>
    </div>
    <div class="memo-preview-content__container">
      <transition-group :name="direction" tag="div" class="card-container">
        <memo-card-preview v-if="current" :key="idx" :idx="idx" :card="current"/>
      </transition-group>
    </div>
    <div class="memo-preview-content__footer">
      <div class="btn" @click="onStudy(MemoDataCardStatusEnum.NOT_REMEMBERED)">
        <div class="text danger">忘记了</div>
        <div class="date">3.6小时</div>
      </div>
      <div class="btn" @click="onStudy(MemoDataCardStatusEnum.BLUR)">
        <div class="text warning">模糊</div>
        <div class="date">7.2小时</div>
      </div>
      <div class="btn" @click="onStudy(MemoDataCardStatusEnum.REMEMBERED)">
        <div class="text success">记住了</div>
        <div class="date">12小时</div>
      </div>
      <t-divider layout="vertical"/>
      <t-popup trigger="click" placement="top" v-model:visible="moreVisible">
        <div class="btn">
          <more-icon/>
        </div>
        <template #content>
          <div class="btn-more">
            <div class="btn" @click="onStudy(MemoDataCardStatusEnum.COMPLETED)">
              <div class="text success">完成学习</div>
              <div class="date">设为完成状态，不在复习</div>
            </div>
            <div class="btn" @click="onStudy(MemoDataCardStatusEnum.UNKNOWN)">
              <div class="text danger">彻底忘记</div>
              <div class="date">重置计划，重新开始复习</div>
            </div>
            <div class="divider"></div>
            <div class="cancel" @click="moreVisible=false">
              <div class="text">取消</div>
            </div>
          </div>
        </template>
      </t-popup>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  IMemoInstance,
  MemoDataCard,
  MemoDataCardStatusEnum,
  MemoDataCardType,
  MemoInstance
} from "@/editor/MemoEditor/types";
import {ChevronLeftIcon, ChevronRightIcon, MoreIcon} from "tdesign-icons-vue-next";
import MemoCardPreview from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreview.vue";

const props = defineProps({
  cards: {
    type: Object as PropType<Array<MemoDataCard<MemoDataCardType>>>,
    default: () => []
  }
});
const instance = inject<IMemoInstance>(MemoInstance);

const idx = ref(instance?.getIndex() || 0);
const direction = ref('slide-right'); // 默认方向
const moreVisible = ref(false);

const current = computed(() => props.cards[idx.value]);
const nexCard = () => {
  direction.value = 'slide-right'; // 向右滑动（新卡片从右侧进入）
  if (idx.value >= props.cards.length - 1) {
    idx.value = 0;
  } else {
    idx.value += 1;
  }
  instance?.setIndex(idx.value);
}
const preCard = () => {
  direction.value = 'slide-left'; // 向左滑动（新卡片从左侧进入）
  if (idx.value <= 0) {
    idx.value = props.cards.length - 1;
  } else {
    idx.value -= 1;
  }
  instance?.setIndex(idx.value);
}

const onStudy = (status: MemoDataCardStatusEnum) => {
  if (!current.value) return;
  instance?.study(current.value.id, status);
  nexCard();
}
</script>
<style scoped lang="less">
.memo-preview-content {
  width: 100%;
  height: 100%;
  position: relative;

  &__header {
    position: absolute;
    height: 32px;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid var(--td-border-level-2-color);
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .progress {
      font-size: var(--td-font-size-body-large);
      font-weight: bold;
      color: var(--td-text-color-secondary);
    }
  }

  &__container {
    position: absolute;
    top: 49px;
    left: 0;
    right: 0;
    bottom: 67px;
    padding: 16px;
    overflow: hidden; /* 确保超出容器的内容被隐藏 */
  }

  .card-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* 确保卡片在容器中的位置固定 */

  :deep(.memo-card-preview) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__footer {
    position: absolute;
    height: 48px;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid var(--td-border-level-2-color);
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .btn {
      height: 35px;
      padding: 2px 24px;
      background-color: var(--td-bg-color-component);
      border-radius: var(--td-radius-medium);
      transition: background-color 0.3s ease-in-out;
      cursor: pointer;
      user-select: none;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &:hover {
        background-color: var(--td-bg-color-component-hover);
      }

      &:active {
        background-color: var(--td-bg-color-component-active);
      }

      .text {
        width: 100%;
        text-align: center;

        &.danger {
          color: var(--td-error-color);
        }

        &.warning {
          color: var(--td-warning-color);
        }

        &.success {
          color: var(--td-success-color);
        }
      }

      .date {
        font-size: var(--td-font-size-body-small);
        color: var(--td-text-color-secondary);
      }
    }
  }
}

.btn-more {
  .btn {
    padding: 2px 24px;
    background-color: var(--td-bg-color-component);
    border-radius: var(--td-radius-medium);
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
    user-select: none;
    margin-top: 8px;


    &:hover {
      background-color: var(--td-bg-color-component-hover);
    }

    &:active {
      background-color: var(--td-bg-color-component-active);
    }

    .text {
      width: 100%;
      text-align: center;

      &.danger {
        color: var(--td-error-color);
      }

      &.success {
        color: var(--td-success-color);
      }

    }

    .date {
      font-size: var(--td-font-size-body-small);
      color: var(--td-text-color-secondary);
    }
  }

  .divider {
    margin-top: 8px;
    border-top: 1px solid var(--td-border-level-2-color);
    content: "";
    margin-bottom: 4px;
    width: 100%;
  }

  .cancel {
    padding: 8px 24px;
    border-radius: var(--td-radius-medium);
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
    user-select: none;
    text-align: center;

    &:hover {
      background-color: var(--td-bg-color-component-hover);
    }

    &:active {
      background-color: var(--td-bg-color-component-active);
    }
  }
}

/* 向右滑动动画（新卡片从右侧进入） */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 向左滑动动画（新卡片从左侧进入） */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
