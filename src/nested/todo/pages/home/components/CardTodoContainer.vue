<template>
  <div class="container list-container">
    <content-default/>
  </div>
</template>
<script lang="ts" setup>
import ContentDefault from "@/pages/todo/ContentDefault/index.vue";
</script>
<style scoped lang="less">
.list-container {

  .todo-layout-list-item {
    padding: 4px 7px;
    border-bottom: 1px solid var(--color-neutral-3);
    display: grid;
    grid-template-columns: 30px 1fr 32px 32px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;

    &:last-child {
      border-bottom: 1px solid transparent;
    }

    &:hover {
      background-color: var(--color-fill-3);
    }

    &.active {
      background-color: var(--color-fill-3);
    }

    .extra {
      color: rgb(var(--orange-6));

      &.disabled {
        color: var(--color-neutral-4);
      }
    }

    .gray {
      color: var(--color-neutral-6);
    }

    .delete {
      text-decoration: line-through
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
