<template>
    <div class="todo-content-calendar">
        <content-calendar-header />
        <content-calendar-main />
    </div>
</template>
<script lang="ts" setup>
import ContentCalendarHeader from "@/pages/todo/components/ContentCalendar/components/ContentCalendarHeader.vue"
import ContentCalendarMain from "@/pages/todo/components/ContentCalendar/components/ContentCalendarMain/index.vue";
</script>
<style lang="less">
@import "./index.less";
</style>
