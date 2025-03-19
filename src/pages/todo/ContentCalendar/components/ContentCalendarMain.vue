<template>
  <div class="content-calendar-main">
    <div class="w-full h-full" ref="el"></div>
  </div>
</template>
<script lang="ts" setup>
import {Calendar, EventSourceInput, EventInput, EventClickArg, EventImpl} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {handlePriorityColor, TodoItemStatus} from "@/entity/todo/TodoItem";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {toDateString} from "@/utils/lang/FormatUtil";

const el = ref();
let calendar: Calendar | null = null;

const todoStore = useTodoItemStore();

async function getEvents(): Promise<EventSourceInput> {
  const events = new Array<EventInput>();
  for (const item of todoStore.items) {
    try {
      const todoItem = await todoStore.getTodoItem(item.id);
      events.push({
        id: todoItem.index.id.toString(),
        title: todoItem.index.title,
        start: todoItem.attr.start || toDateString(todoItem.index.id, 'YYYY-MM-DD'),
        end: todoItem.attr.end || todoItem.attr.start || toDateString(todoItem.index.id, 'YYYY-MM-DD'),
        backgroundColor: todoItem.index.status === TodoItemStatus.COMPLETE ? '#86909c' : handlePriorityColor(todoItem.index.priority),
        editable: true
      });
    } catch (e) {
      console.error(e);
    }
  }
  return events;
}

function handleEventClick(info: EventClickArg) {
  const targetId = parseInt(info.event.id);
  const target = todoStore.items.find(item => item.id === targetId);
  if (target) {
    openTodoItemSetting(target)
  }
}

onMounted(() => {
  (async () => {
    calendar = new Calendar(el.value, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today,addEventButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      locale: 'zh-cn',
      timeZone: 'Asia/Shanghai',
      editable: true,
      dayMaxEvents: true,
      droppable: true,
      events: await getEvents(),
      eventClick: handleEventClick,
      customButtons: {
        addEventButton: {
          text: '新增日程',
          click: function () {
            openAddTodoItem();
          }
        }
      },
      eventDrop: function (info: {event: EventClickArg['event'], oldEvent: EventClickArg['event']}) {
        const {event} = info;
        const targetId = parseInt(info.event.id);
        todoStore.updateById(targetId, {}, {
          start: event.startStr,
          end: event.endStr
        });
      },
    });
    calendar.render();


    // 监听待办数据变化
    watch(() => todoStore.items, async () => {
      calendar?.removeAllEvents();
      calendar?.addEventSource(await getEvents());
    }, {deep: true})
  })().catch(console.error);
});
</script>
<style scoped lang="less">
.content-calendar-main {
  padding: 0 8px 8px;
}
</style>