<style scoped lang="less">
.amazing-checkbox {
  display: inline-block;
  width: 32px;
  height: 32px;
}

.amazing-checkbox input[type="checkbox"] {
  display: none;
}

.amazing-checkbox label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  position: relative;
}

.amazing-checkbox .checkbox-icon {
  width: 2em;
  height: 2em;
  border: 0.2em solid var(--td-border-level-2-color);
  border-radius: 0.3em;
  display: inline-block;
  position: relative;
  transition: background 0.3s,
  border-color 0.3s,
  transform 0.3s;
  overflow: hidden;
}

.amazing-checkbox .checkbox-icon::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  background: var(--td-success-color);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.amazing-checkbox label:hover .checkbox-icon {
  border-color: var(--td-success-color-hover);
}


.amazing-checkbox .checkbox-icon .checkmark {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 1em;
  height: 1em;
  opacity: 0;
  pointer-events: none;
}

label.check .checkbox-icon {
  background: var(--td-success-color-active);
  border-color: transparent;
  animation: pop 0.3s ease-out;
}

label.check
.checkbox-icon
.checkmark {
  animation: checkmarkIn 0.3s forwards;
}

label.check .checkbox-icon::before {
  animation: ripple 0.6s ease-out;
}

label
.checkbox-icon
.checkmark {
  animation: checkmarkOut 0.3s forwards;
}

.checkmark {
  color: var(--td-text-color-anti);
}

/* Keyframes for pop-effekt */
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.1);
  }
}

/* Keyframes for checkmark inn-animasjon */
@keyframes checkmarkIn {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  80% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* Keyframes for checkmark ut-animasjon */
@keyframes checkmarkOut {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
}

/* Keyframes for ripple-effekten */
@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.7;
  }
  100% {
    width: 4em;
    height: 4em;
    opacity: 0;
  }
}
</style>

<template>
  <div class="amazing-checkbox">
    <label :class="{check: modelValue}" @click="modelValue=!modelValue">
      <span class="checkbox-icon">
        <check-icon class="checkmark" size="24px"/>
      </span>
    </label>
  </div>
</template>
<script setup lang="ts">
import {CheckIcon} from "tdesign-icons-vue-next";

const modelValue = defineModel<boolean>()
</script>