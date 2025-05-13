import {TodoItemIndex, TodoItemStatus} from "@/entity/todo/TodoItem";
import {useTodoItemStore} from "@/store";
import dayjs from "dayjs";

interface UseTodoDateValue {
  text: string;
  // 0,1:未开始,2:进行中,3:已过期
  status: 0 | 1 | 2 | 3
}

interface UseTodoDateResult {
  date: Ref<UseTodoDateValue>;

  onUpdate(): Promise<void>;
}

const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 获取待办的日期信息
 * @param item 待办项
 */
export function useTodoDate(item?: TodoItemIndex): UseTodoDateResult {

  const date = ref<UseTodoDateValue>({
    status: 0,
    text: ''
  });

  async function onUpdate() {
    if (!item) {
      date.value = {status: 0, text: ''};
      return;
    }
    const {id, status} = item;
    if (status === TodoItemStatus.COMPLETE || status === TodoItemStatus.ABANDON) {
      date.value = {status: 0, text: ''};
      return;
    }
    const res = await useTodoItemStore().getTodoItemAttr(id)
    if (!res.start) {
      date.value = {status: 0, text: ''};
      return;
    }
    const now = dayjs();
    const start = dayjs(res.start);
    const end = dayjs(res.end || res.start);
    const startDiff = start.diff(now, 'day');
    console.log('startDiff:', startDiff)
    if (startDiff === 0) {
      if (start.day() === now.day()) {
        // 就是今天
        date.value = {status: 2, text: '今天'};
      } else {
        date.value = {status: 1, text: '明天'};
      }
    } else if (now.isBefore(start, 'day')) {
      if (now.diff(start, 'week') === 0) {
        // 如果是下周，则显示下周几，需要加上这已经过去的天数
        date.value = {status: 1, text: startDiff + '天后'};
      } else if (now.diff(start, 'week') === -1) {
        // 如果是下周，则显示下周几，需要加上这已经过去的天数
        date.value = {status: 1, text: '下周' + dayOfWeek[start.day()]};
      } else if (now.diff(start, 'year') === 0) {
        // 如果是今年内，则显示几月几日，需要加上今年的天数
        date.value = {status: 1, text: start.format('MM-DD')};
      } else {
        // 如果是明年以后则直接显示日期
        date.value = {status: 1, text: start.format('YYYY-MM-DD')};
      }
    } else {
      if (end.isBefore(now, 'day')) {
        const endDiff = end.diff(now, 'day');
        console.log('endDiff:', endDiff)
        if (endDiff === -1) {
          date.value = {status: 3, text: '昨天'};
        } else {
          // 结束时间在今天之前，已过期
          date.value = {status: 3, text: start.format('MM-DD')};
        }
      } else {
        const endDiff = now.diff(end, 'day');
        if (endDiff === 0) {
          date.value = {status: 2, text: '今天'};
        } else if (endDiff === 1) {
          date.value = {status: 2, text: '明天'};
        } else if (now.diff(start, 'year') === 0) {
          // 今年内
          date.value = {status: 2, text: start.format('MM-DD')};
        } else {
          // 如果是明年以后则直接显示日期
          date.value = {status: 2, text: start.format('YYYY-MM-DD')};
        }
      }
    }
  }

  return {date, onUpdate};

}