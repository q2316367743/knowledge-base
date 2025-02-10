<template>
  <div class="todo-content-calendar">
    <todo-header/>
    <content-calendar-main/>
  </div>
</template>
<script lang="ts" setup>
import ContentCalendarMain from "@/pages/todo/components/ContentCalendar/components/ContentCalendarMain.vue";
import TodoHeader from "@/pages/todo/components/common/TodoHeader.vue";
</script>
<style lang="less">
@import "./index.less";
</style>
