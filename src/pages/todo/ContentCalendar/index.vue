<template>
  <div class="todo-content-calendar">
    <todo-header/>
    <content-calendar-main/>
  </div>
</template>
<script lang="ts" setup>
import ContentCalendarMain from "@/pages/todo/ContentCalendar/components/ContentCalendarMain.vue";
import TodoHeader from "@/pages/todo/common/TodoHeader/TodoHeader.vue";
</script>
<style lang="less">
@import "index.less";
</style>
