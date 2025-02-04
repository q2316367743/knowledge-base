import {Input, Modal, Typography, TypographyParagraph} from "@arco-design/web-vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoItemStore} from "@/store/components/TodoItemStore";
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";

/**
 * 打开添加分组功能
 */
export function openEditTodoGroupFunc(oldId: string, oldName: string, items: Array<TodoGroupPriorityView>) {
  const name = ref(oldName);
  const op = oldId === '0' ? '添加' : '修改';
  Modal.open({
    title: op + '分组',
    width: 400,
    content: () => <Typography>
      <TypographyParagraph>请输入分组名称：</TypographyParagraph>
      <TypographyParagraph>
        <Input v-model={name.value} allowClear/>
      </TypographyParagraph>
    </Typography>,
    async onBeforeOk(done) {
      if (name.value.trim() === '') {
        MessageUtil.error('分组名称不能为空');
        done(false);
        return;
      }
      try {
        await useTodoItemStore().postGroup(oldId, name.value,
          items.flatMap(e => e.children).map(e => e.id))
        MessageUtil.success(op + '分组');
        done(true);
      } catch (e) {
        MessageUtil.error(op + '失败', e);
        done(false);
      }
    }
  })
}

export function openDeleteTodoGroupFunc(id: string, name: string) {
  Modal.open({
    title: '删除分组',
    width: 400,
    content: () => <Typography>
      <TypographyParagraph>确定要删除分组：{name} 吗？</TypographyParagraph>
    </Typography>,
    async onBeforeOk(done) {
      try {
        await useTodoItemStore().deleteGroup(id);
        MessageUtil.success('删除分组');
        done(true);
      } catch (e) {
        MessageUtil.error('删除分组失败', e);
        done(false);
      }
    }
  })
}