import ContextMenu, {MenuItem} from '@imengyu/vue3-context-menu';
import {DeleteIcon, EditIcon, PlusIcon, RoundIcon, TerminalWindowIcon} from "tdesign-icons-vue-next";
import {useGlobalStore, useVipStore} from "@/store";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import {openAddTodoCategory, openUpdateTodoCategory} from "@/pages/todo/TodoSide/AddTodoCategory";
import VipIcon from "@/components/KbIcon/VipIcon.vue";

interface ContextmenuForTodo {
  e: MouseEvent;
  id: number;
  childLength: number;
  onOpen: () => void;
  onOpenWidget: () => void
}

export function onContextmenuForTodo(props: ContextmenuForTodo) {
  const {e, id, childLength, onOpen, onOpenWidget} = props;
  const category = useTodoCategoryStore().todoCategoryMap.get(id);
  const {todoNoVip} = useVipStore()
  if (!category) {
    return;
  }
  const items = new Array<MenuItem>();

  if (category.type === TodoCategoryTypeEnum.FOLDER) {
    // 文件夹
    items.push({
      label: '新增',
      icon: () => <PlusIcon/>,
      onClick: () => openAddTodoCategory(id)
    })
  } else if (category.type === TodoCategoryTypeEnum.TODO) {
    items.push({
      label: '打开',
      icon: () => <RoundIcon/>,
      onClick: onOpen
    }, {
      label: () => <div class={'flex items-center'}>
        <div>打开小部件</div>
        {todoNoVip && <VipIcon style={{marginLeft: '4px'}}/>}
      </div>,
      icon: () => <TerminalWindowIcon/>,
      onClick: onOpenWidget
    })
  }

  items.push({
    label: '修改',
    icon: () => <EditIcon/>,
    onClick: () => openUpdateTodoCategory(id)
  });

  if (category.type === TodoCategoryTypeEnum.TODO || childLength === 0) {
    items.push({
      label: <div style={{color: 'var(--td-error-color)'}}>删除</div>,
      icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
      onClick: () => useTodoCategoryStore().remove(id)
    });
  }

  // if (category.type === TodoCategoryTypeEnum.TODO) {
  //   items.push({
  //     label: '快速启动',
  //     icon: () => hasFeature(id) ? <StarFilledIcon/> : <StarIcon/>,
  //     onClick: () => {
  //       if (hasFeature(id)) {
  //         removeFeature(id);
  //       } else {
  //         addFeature(id);
  //       }
  //     }
  //   });
  // }

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items
  })
}