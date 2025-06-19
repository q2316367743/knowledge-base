import {Input, DialogPlugin, Radio, RadioGroup, Select, Paragraph} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";

/**
 * 打开添加分组功能
 */
function openEditTodoGroupFuncWrap(oldId: string, oldName: string, items: Array<TodoItemIndex>) {
  const name = ref(oldName);
  const op = oldId === '0' ? '添加' : '修改';
  const d = DialogPlugin({
    header: op + '分组',
    width: 400,
    draggable: true,
    placement: "center",
    closeOnEscKeydown: false,
    default: () => <div>
      <Paragraph>请输入分组名称：</Paragraph>
      <Paragraph>
        <Input v-model={name.value} clearable={true}/>
      </Paragraph>
    </div>,
    async onConfirm() {
      if (name.value.trim() === '') {
        MessageUtil.error('分组名称不能为空');
        return;
      }
      try {
        await useTodoWrapStore().postGroup(oldId, name.value,
          items.map(e => e.id))
        MessageUtil.success(op + '分组成功');
        d.destroy();
      } catch (e) {
        MessageUtil.error(op + '分组失败', e);
      }
    }
  })
}


export function openEditTodoGroupFunc(group?: TodoGroupView) {
  if (group) openEditTodoGroupFuncWrap(group.id, group.name, [...group.children.flatMap(e => e.children), ...group.complete])
  else openEditTodoGroupFuncWrap('0', '', [])
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
  const d = DialogPlugin({
    header: '删除分组',
    width: 400,
    default: () => <div>
      <Paragraph>确定要删除分组：{name} 吗？</Paragraph>
      <Paragraph>
        <RadioGroup v-model={targetType.value}>
          <Radio value={'-1'} label={'同时删除分组下的所有待办'} class={'mr-auto'}/>
          <Radio value={'0'} label={'仅删除分组'} class={'mr-auto'}/>
          <Radio value={'1'} disabled={options.value.length === 0} label={'删除分组，将任务移动到...'}
                 class={'mr-auto'}/>
        </RadioGroup>
      </Paragraph>
      {targetType.value === '1' && <Paragraph>
        <Select v-model={targetGroupId.value} options={options.value}/>
      </Paragraph>}
    </div>,
    async onConfirm() {
      try {
        await useTodoGroupStore().deleteById(id, targetType.value === '1' ? targetGroupId.value : targetType.value);
        MessageUtil.success('删除分组');
        d.destroy();
      } catch (e) {
        MessageUtil.error('删除分组失败', e);
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