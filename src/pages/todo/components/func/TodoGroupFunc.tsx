import {Input, Modal, Radio, RadioGroup, Select, Typography, TypographyParagraph} from "@arco-design/web-vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

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
        await useTodoWrapStore().postGroup(oldId, name.value,
          items.flatMap(e => e.children).map(e => e.id))
        MessageUtil.success(op + '分组成功');
        done(true);
      } catch (e) {
        MessageUtil.error(op + '分组失败', e);
        done(false);
      }
    }
  })
}

export function openDeleteTodoGroupFunc(id: string, name: string) {
  const targetType = ref('0');
  const targetGroupId = ref('');
  const options = computed(() => {
    const i = useTodoGroupStore().items.map(e => ({
      label: e.name,
      value: e.id
    })).filter(e => e.value !== id);
    targetGroupId.value = i['0']?.value || ''
    return i;
  })
  Modal.open({
    title: '删除分组',
    width: 400,
    content: () => <Typography>
      <TypographyParagraph>确定要删除分组：{name} 吗？</TypographyParagraph>
      <TypographyParagraph>
        <RadioGroup v-model={targetType.value} direction={'vertical'}>
          <Radio value={'-1'}>同时删除分组下的所有待办</Radio>
          <Radio value={'0'}>仅删除分组</Radio>
          <Radio value={'1'} disabled={options.value.length === 0}>删除分组，将任务移动到...</Radio>
        </RadioGroup>
      </TypographyParagraph>
      {targetType.value === '1' && <TypographyParagraph>
        <Select v-model={targetGroupId.value} options={options.value}/>
      </TypographyParagraph>}
    </Typography>,
    async onBeforeOk(done) {
      try {
        await useTodoGroupStore().deleteById(id, targetType.value === '1' ? targetGroupId.value : targetType.value);
        MessageUtil.success('删除分组');
        done(true);
      } catch (e) {
        MessageUtil.error('删除分组失败', e);
        done(false);
      }
    }
  })
}


export function openAddTodoGroupFunc(id: string, offset: 1 | 0) {
  MessageBoxUtil.prompt("请输入分组名称", '添加分组', {
    confirmButtonText: '添加',
  }).then(async name => {
    if (name.trim() === '') {
      MessageUtil.warning('分组名称不能为空');
      return;
    }
    try {
      await useTodoWrapStore().addGroupTo(name, id, offset);
      MessageUtil.success('添加分组成功');
    } catch (e) {
      MessageUtil.error('添加分组失败', e);
    }
  })
}