<template>
  <div class="memo-preview-content">
    <div class="memo-preview-content__container">
      <transition-group :name="direction" tag="div" class="card-container">
        <memo-card-preview v-if="current" :key="idx" :idx="idx" :card="current"/>
      </transition-group>
    </div>
    <div class="memo-preview-content__footer">
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
  </div>
</template>
<script lang="ts" setup>
import {IMemoInstance, MemoDataCard, MemoDataCardType, MemoInstance} from "@/editor/MemoEditor/types";
import {ChevronLeftIcon, ChevronRightIcon} from "tdesign-icons-vue-next";
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
</script>
<style scoped lang="less">
.memo-preview-content {
  width: 100%;
  height: 100%;
  position: relative;

  &__container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 49px;
    padding: 24px;
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
    height: 32px;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid var(--td-border-level-2-color);
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
