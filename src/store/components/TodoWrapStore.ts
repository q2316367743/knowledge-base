import {defineStore} from "pinia";
import {
  TodoItemAttr,
  TodoItemIndex,
} from "@/entity/todo/TodoItem";
import {TodoGroup, TodoGroupView} from "@/entity/todo/TodoGroup";
import {map} from "@/utils/lang/ArrayUtil";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {
  renderTodoListLayout,
  TodoCategory,
  TodoCategoryGroupEnum,
  TodoCategoryTypeEnum,
  TodoListLayoutEnum
} from "@/entity/todo/TodoCategory";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useUmami} from "@/plugin/umami";
import {renderGroupViews} from "@/utils/component/TodoUtil";
import {useTodoArticleStore} from "@/store/db/TodoArticleStore";
import {useTodoWidgetStore} from "@/store/components/TodoWidgetStore";
import {checkPower} from "@/store";

// 此store只负责展示，不负责增删改
export const useTodoWrapStore = defineStore('todo-item', () => {
  // 当前打开的清单ID
  const categoryId = ref(0);
  // 当前打开的待办项
  const itemId = ref(0);
  const collapsed = ref(false);

  const sort = ref(TodoListSortEnum.PRIORITY);
  const layout = ref(TodoListLayoutEnum.DEFAULT);
  const hideOfCompleteOrAbandon = ref(false);
  const hideOfArticle = ref(false);
  const showAddGroupBtn = ref(false);
  const groupType = ref(TodoCategoryGroupEnum.DEFAULT);

  const loading = ref(false);

  // 待办
  const todoGroupView = computed<Array<TodoGroupView>>(
    () => {
      if (categoryId.value === 0) {
        return [];
      }
      return renderGroupViews(useTodoItemStore().items, useTodoGroupStore().items, categoryId.value, sort.value)
    });
  const currentCategory = computed<TodoCategory | undefined>(() => {
    if (categoryId.value === 0) {
      return undefined;
    }
    const {value} = useTodoCategoryStore();
    for (const item of value) {
      if (item.id === categoryId.value) {
        return item;
      }
    }
    return undefined;
  });

  async function init(id: number, widget = false) {
    try {
      loading.value = true;
      // 清空
      categoryId.value = id;
      itemId.value = 0;
      sort.value = TodoListSortEnum.PRIORITY;
      layout.value = TodoListLayoutEnum.DEFAULT;
      hideOfCompleteOrAbandon.value = false;
      hideOfArticle.value = false;
      showAddGroupBtn.value = false;
      groupType.value = TodoCategoryGroupEnum.DEFAULT;
      // 获取当前分组信息
      const todoCategory = map(useTodoCategoryStore().value, 'id').get(id);
      if (!todoCategory) {
        MessageUtil.error("待办分类不存在，请刷新页面重试");
        categoryId.value = 0;
        return;
      }
      if (todoCategory.type !== TodoCategoryTypeEnum.TODO) {
        MessageUtil.error("待办分类类型错误，请刷新页面重试");
        categoryId.value = 0;
        return;
      }
      if (id === 0 || widget) {
        // 销毁内存数据
        useTodoGroupStore().destroy();
        useTodoItemStore().destroy();
        useTodoArticleStore().destroy();
        // 打开小部件
        if (widget) {
          try {
            await useTodoWidgetStore().openWidget(id, todoCategory.name)
          } catch (e) {
            categoryId.value = 0;
            MessageUtil.error("打开小部件失败", e);
          }
        }
        return;
      }

      // 只要ID大于0，这几项就要刷新
      sort.value = todoCategory.todoListSort || TodoListSortEnum.PRIORITY;
      layout.value = todoCategory.todoListLayout || TodoListLayoutEnum.DEFAULT;
      hideOfCompleteOrAbandon.value = todoCategory.hideOfCompleteOrAbandon || false;
      hideOfArticle.value = todoCategory.hideOfArticle || false;
      showAddGroupBtn.value = todoCategory.showAddGroupBtn || false;
      groupType.value = todoCategory.groupType || TodoCategoryGroupEnum.DEFAULT;
      // 事件
      useUmami.track(`/待办/布局/${renderTodoListLayout(layout.value)}`)

      try {
        // 获取分组
        await useTodoGroupStore().init(id);
      } catch (e) {
        console.error("获取待办分组失败", e);
      }

      try {
        // 获取待办项
        await useTodoItemStore().init(id)
      } catch (e) {
        console.error("获取待办项失败", e);
      }
      try {
        // 获取待办关联笔记
        await useTodoArticleStore().init(id);
      } catch (e) {
        console.error("获取待办项失败", e);
      }
    } catch (e) {
      console.error("初始化待办失败", e);
    } finally {
      loading.value = false;
    }
  }

  function setItemId(id: number) {
    itemId.value = id;
  }

  const collapsedToggle = useToggle(collapsed);

  const switchCollapsed = () => collapsedToggle();

  const postGroup = async (id: string, name: string, items: Array<number>) => {
    // 处理分组
    return useTodoGroupStore().saveOrUpdate(id, name, items, categoryId.value);
  };
  const deleteGroup = async (id: string, targetGroupId: string) => {
    await useTodoGroupStore().deleteById(id, targetGroupId);
  };
  const addGroupTo = async (name: string, id: string, offset: 1 | 0) => {
    return useTodoGroupStore().addOneTo(name, id, categoryId.value, offset);
  }

  async function addItem(record: Partial<TodoItemIndex>, attr: Partial<TodoItemAttr>, group?: TodoGroup) {
    // 添加到待办
    const target = await useTodoItemStore().addSimple(categoryId.value, record, attr);
    // 添加到分组
    if (group) {
      await useTodoGroupStore().pushTo(group, target.id)
    }
  }

  return {
    categoryId, itemId, currentCategory, sort, layout, collapsed, groupType,
    todoGroupView, hideOfCompleteOrAbandon, hideOfArticle, showAddGroupBtn, loading,
    init, setItemId, switchCollapsed,
    postGroup, deleteGroup, addGroupTo,
    addItem
  }

})