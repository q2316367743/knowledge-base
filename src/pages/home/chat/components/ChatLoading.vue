<template>
  <div class="t-chat-loading">
    <div class="t-chat-loading__indicator t-chat-loading__indicator--gradient"></div>
    <div class="t-chat-loading__text"></div>
  </div>
</template>
<script lang="ts" setup>
</script>
<style scoped lang="less">
.t-chat-loading {
  display: flex;
  align-items: center
}

.t-chat-loading__indicator--moving {
  position: relative;
  width: 14px;
  height: 14px
}

.t-chat-loading__indicator--moving .t-chat-loading__dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: var(--td-radius-circle);
  background-color: var(--td-brand-color)
}

.t-chat-loading__indicator--moving .t-chat-loading__dot--top {
  top: -4px;
  left: 3px;
  animation: dot-moving-top .6s ease-in-out alternate infinite
}

.t-chat-loading__indicator--moving .t-chat-loading__dot--left {
  bottom: -5px;
  left: -5px;
  animation: dot-moving-left .6s ease-in-out alternate infinite
}

.t-chat-loading__indicator--moving .t-chat-loading__dot--right {
  bottom: -5px;
  right: -5px;
  animation: dot-moving-right .6s ease-in-out alternate infinite
}

.t-chat-loading__indicator--gradient {
  width: 14px;
  height: 14px;
  background-color: transparent;
  border-radius: var(--td-radius-circle);
  border: 1.5px solid var(--td-brand-color);
  animation: border-gradient-color .6s ease-in-out alternate infinite;
  box-sizing: border-box
}

@keyframes border-gradient-color {
  0% {
    border-color: var(--td-brand-color);
    border-width: 1.5px
  }

  50% {
    border-color: var(--td-brand-color-8);
    border-width: 3px
  }

  to {
    border-color: var(--td-brand-color-6);
    border-width: 4px
  }
}

@keyframes dot-moving-top {
  0% {
    transform: scale(1);
    top: -4px
  }

  to {
    transform: scale(1.75);
    top: 3px
  }
}

@keyframes dot-moving-left {
  0% {
    transform: scale(1);
    bottom: -4px;
    left: -4px
  }

  to {
    transform: scale(1.75);
    bottom: 3px;
    left: 3px
  }
}

@keyframes dot-moving-right {
  0% {
    transform: scale(1);
    bottom: -4px;
    right: -4px
  }

  to {
    transform: scale(1.75);
    bottom: 3px;
    right: 3px
  }
}

.t-chat-loading__text {
  margin-left: 8px
}
</style>
