<template>
  <div class="todo-item-checkbox" :title @click="handleClick">
    <div class="todo-item-checkbox-hover">
      <div class="todo-item-checkbox-icon" :style>
        <svg aria-hidden="true" focusable="false" v-if="status === TodoItemStatus.COMPLETE"
             viewBox="0 0 1024 1024" width="10" height="10" fill="#ffffff"
             class="todo-item-checkbox-icon-check">
          <path
            d="M877.44815445 206.10060629a64.72691371 64.72691371 0 0 0-95.14856334 4.01306852L380.73381888 685.46812814 235.22771741 533.48933518a64.72691371 64.72691371 0 0 0-92.43003222-1.03563036l-45.82665557 45.82665443a64.72691371 64.72691371 0 0 0-0.90617629 90.61767965l239.61903446 250.10479331a64.72691371 64.72691371 0 0 0 71.19960405 15.14609778 64.33855261 64.33855261 0 0 0 35.08198741-21.23042702l36.24707186-42.71976334 40.5190474-40.77795556-3.36579926-3.49525333 411.40426297-486.74638962a64.72691371 64.72691371 0 0 0-3.88361443-87.64024149l-45.3088404-45.43829334z"
          ></path>
        </svg>
        <svg class="todo-item-checkbox-icon-check" viewBox="0 0 1025 1024"
             xmlns="http://www.w3.org/2000/svg"
             width="10" height="10" v-else-if="status === TodoItemStatus.DOING">
          <path d="M1.024 448.512h1024v128h-1024z" fill="#ffffff"></path>
        </svg>
        <svg class="todo-item-checkbox-icon-check" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
             width="10" height="10"  v-else-if="status === TodoItemStatus.ABANDON">
          <path
            d="M886.784 746.496q29.696 30.72 43.52 56.32t-4.608 58.368q-4.096 6.144-11.264 14.848t-14.848 16.896-15.36 14.848-12.8 9.728q-25.6 15.36-60.416 8.192t-62.464-34.816l-43.008-43.008-57.344-57.344-67.584-67.584-73.728-73.728-131.072 131.072q-60.416 60.416-98.304 99.328-38.912 38.912-77.312 48.128t-68.096-17.408l-7.168-7.168-11.264-11.264-11.264-11.264q-6.144-6.144-7.168-8.192-11.264-14.336-13.312-29.184t2.56-29.184 13.824-27.648 20.48-24.576q9.216-8.192 32.768-30.72l55.296-57.344q33.792-32.768 75.264-73.728t86.528-86.016q-49.152-49.152-93.696-93.184t-79.872-78.848-57.856-56.832-27.648-27.136q-26.624-26.624-27.136-52.736t17.92-52.736q8.192-10.24 23.552-24.064t21.504-17.92q30.72-20.48 55.296-17.92t49.152 28.16l31.744 31.744q23.552 23.552 58.368 57.344t78.336 76.288 90.624 88.576q38.912-38.912 76.288-75.776t69.632-69.12 58.368-57.856 43.52-43.008q24.576-23.552 53.248-31.232t55.296 12.8q1.024 1.024 6.656 5.12t11.264 9.216 10.752 9.728 7.168 5.632q27.648 26.624 27.136 57.856t-27.136 57.856q-18.432 18.432-45.568 46.08t-60.416 60.416-70.144 69.632l-77.824 77.824q37.888 36.864 74.24 72.192t67.584 66.048 56.32 56.32 41.472 41.984z"
            fill="#ffffff"></path>
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {getNextTodoItemStatus, handleStatusText, TodoItemPriority, TodoItemStatus} from "@/entity/todo/TodoItem";
import {StyleValue} from "vue";

const props = defineProps({
  priority: {
    type: Number as PropType<TodoItemPriority>,
    default: 4
  },
  status: {
    type: Number as PropType<TodoItemStatus>,
    default: 1
  }
});
const emit = defineEmits(['update:status']);

const style = computed<StyleValue>(() => {
  const s: StyleValue = {};
  if (props.status === TodoItemStatus.COMPLETE || props.status === TodoItemStatus.ABANDON) {
    s.borderColor = 'var(--color-fill-3)';
    s.backgroundColor = 'var(--color-fill-3)';
  } else {
    if (props.priority === TodoItemPriority.HIGH) {
      s.borderColor = 'rgb(var(--red-6))';
    } else if (props.priority === TodoItemPriority.MIDDLE) {
      s.borderColor = 'rgb(var(--orange-6))';
    } else if (props.priority === TodoItemPriority.FLOOR) {
      s.borderColor = 'rgb(var(--arcoblue-6))';
    }
    if (props.status === TodoItemStatus.DOING) {
      s.backgroundColor = s.borderColor;
    }
  }
  return s;
});
const title = computed(() => handleStatusText(props.status));

function handleClick() {
  emit('update:status', getNextTodoItemStatus(props.status));
}
</script>
<style scoped lang="less">
.todo-item-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 5px;
  font-size: 14px;
  line-height: unset;
  cursor: pointer;

  &:hover {
    .todo-item-checkbox-hover {
      &:before {
        background-color: var(--color-fill-2);
      }
    }

  }

  .todo-item-checkbox-hover {
    position: relative;
    display: inline-block;
    cursor: pointer;
    line-height: 12px;

    &:before {
      width: 24px;
      height: 24px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .todo-item-checkbox-icon-check {
      position: absolute;
      display: block;
      box-sizing: border-box;
      background-color: transparent;
      border-radius: var(--border-radius-circle);
      content: "";
      transform: scale(1);
      transition: transform .3s cubic-bezier(.3, 1.3, .3, 1);
    }
  }

  .todo-item-checkbox-icon {
    position: relative;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: var(--color-bg-2);
    border: 2px solid var(--color-fill-3);
    border-radius: var(--border-radius-small);
    user-select: none;

    &:after {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      width: 6px;
      height: 2px;
      background: var(--color-white);
      border-radius: 0.5px;
      transform: translate(-50%) translateY(-50%) scale(0);
      content: "";
    }
  }

}
</style>
