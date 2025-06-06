import {useAiChatListStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";

interface ChatMoveProps {
  chatId: string;
  fromGroupId: string;
  targetGroupId: string;
  onSuccess?: () => void;
}

/**
 * 对话移动
 */
export async function chatMove(props: ChatMoveProps) {
  const {chatId, fromGroupId, targetGroupId, onSuccess} = props;
  // 获取原分组
  const fromGroup = await useAiChatListStore().listBy(fromGroupId);
  // 获取目标分组
  const targetGroup = await useAiChatListStore().listBy(targetGroupId);
  // 旧的分组中删除这个对话
  const index = fromGroup.list.findIndex((item) => item.id === chatId);
  if (index > -1) {
    const target = fromGroup.list[index];
    fromGroup.list.splice(index, 1);
    await useAiChatListStore().saveList(fromGroupId, fromGroup);
    // 添加到新的分组
    targetGroup.list.push(target);
    await useAiChatListStore().saveList(targetGroupId, targetGroup);
    onSuccess?.();
    // 如果默认分组发生改变，需要重新初始化
    if (fromGroupId === '0' || targetGroupId === '0') {
      await useAiChatListStore().reInit();
    }
    MessageUtil.success("移动成功");
  }

}