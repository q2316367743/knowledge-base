import ContextMenu from '@imengyu/vue3-context-menu';
import {CalendarIcon, PlusIcon} from 'tdesign-icons-vue-next';
import dayjs from "dayjs";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";

export function openContextMenuForDay(e: MouseEvent, day: Date) {
  const now = dayjs(day).format("YYYY-MM-DD");
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [{
      label: now,
      icon: () => <CalendarIcon/>,
      divided: true,
      clickClose: false
    }, {
      label: '新增',
      icon: () => <PlusIcon/>,
      onClick: () => {
        openAddTodoItem({start: now});
      }
    }]
  })
}