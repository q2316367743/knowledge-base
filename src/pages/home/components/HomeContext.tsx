import {AiChatGroup, AiChatList} from "@/entity/ai/AiChat";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useAiChatListStore} from "@/store/ai/AiChatListStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {activeKey} from "@/pages/home/model";
import {useAiChatGroupStore} from "@/store";

export function onRenameChat(groupId: string, data: AiChatList, onUpdate?: (name: string) => void) {
  MessageBoxUtil.prompt("请输入新的对话名称", "编辑对话名称", {
    inputValue: data.name,
    maxlength: 10
  })
    .then(name => {
      useAiChatListStore().updateById(groupId, {
        id: data.id,
        name,
      })
        .then(() => {
          MessageUtil.success("修改成功");
          onUpdate?.(name);
        })
        .catch(e => MessageUtil.error("修改失败", e));
    })
}

export function onTopChat(groupId: string, data: AiChatList) {
  useAiChatListStore().updateById(groupId, {
    id: data.id,
    top: !data.top,
  })
    .then(() => MessageUtil.success("修改成功"))
    .catch(e => MessageUtil.error("修改失败", e));
}

export function onRemoveChat(groupId: string, id: string, onUpdate?: () => void) {
  MessageBoxUtil.confirm("是否删除此聊天", "删除聊天").then(() => {
    useAiChatListStore().remove(groupId, id)
      .then(() => {
        MessageUtil.success("删除成功");
        onUpdate?.();
        // 如果是当前
        if (activeKey.value === `/home/chat/${groupId}/${id}`) {
          // 变为新聊天
          activeKey.value = '/home/welcome';
        }
      })
      .catch(e => MessageUtil.error("删除失败", e));
  })
}

export function onRenameGroup(group: AiChatGroup, onUpdate?: () => void) {
  MessageBoxUtil.prompt("请输入新的分组名称", "编辑分组名称", {
    inputValue: group.name,
    maxlength: 10
  })
    .then(name => {
      useAiChatGroupStore().renameById(group.id, name)
        .then(() => {
          MessageUtil.success("修改成功");
          onUpdate?.();
        })
        .catch(e => MessageUtil.error("修改失败", e));
    })
}

export function onRemoveGroup(id: string, onUpdate?: () => void) {
  MessageBoxUtil.confirm("是否删除此分组", "删除分组")
    .then(() => useAiChatGroupStore().removeById(id)
      .then(() => {
        MessageUtil.success("删除成功");
        onUpdate?.();
      })
      .catch(e => MessageUtil.error("删除失败", e)))
}