<template>
  <div class="todo-item-checkbox">
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
        <svg class="todo-item-checkbox-icon-check" viewBox="0 0 1024 1024"
             xmlns="http://www.w3.org/2000/svg"
             width="10" height="10" v-else-if="status === TodoItemStatus.ABANDON">
          <path d="M1023.035952 170.907721l-852.12806 852.128061L0.241225 852.730697l852.248588-852.12806z"
          ></path>
          <path d="M170.425782 0l852.128061 852.12806L852.248758 1022.794727l-852.12806-852.248588z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemPriority, TodoItemStatus} from "@/entity/todo/TodoItem";
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
})

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
