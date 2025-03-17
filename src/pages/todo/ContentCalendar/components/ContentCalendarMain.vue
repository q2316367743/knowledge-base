<template>
  <div class="content-calendar-main">
    <div class="w-full h-full" ref="el"></div>
  </div>
</template>
<script lang="ts" setup>
import {Calendar} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {useTodoItemStore} from "@/store/db/TodoItemStore";

const el = ref();

onMounted(() => {
  const {items} = useTodoItemStore();
  let calendar = new Calendar(el.value, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    locale: 'zh'
  });
  calendar.render();
})
</script>
<style scoped lang="less">
.content-calendar-main {
  padding: 0 8px 8px;
}
</style>
