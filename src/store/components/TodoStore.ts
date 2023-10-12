import {defineStore} from "pinia";
import {
    getDefaultTodoItemContent,
    getDefaultTodoItemIndex,
    TodoItem,
    TodoItemContent,
    TodoItemIndex,
    TodoItemStatus
} from "@/entity/todo/TodoItem";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {
    getFromOneByAsync,
    getItemByDefault,
    listByAsync,
    removeOneByAsync,
    saveListByAsync,
    saveOneByAsync,
    setItem
} from "@/utils/utools/DbStorageUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {clone} from "xe-utils";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";

function sortTodoIndex(a: TodoItemIndex, b: TodoItemIndex, sort: TodoListSortEnum): number {
    if (a.top) {
        return -1;
    }
    if (b.top) {
        return 1;
    }
    if (sort === TodoListSortEnum.PRIORITY) {
        return a.priority - b.priority || a.id - b.id;
    } else if (sort === TodoListSortEnum.NAME_ASC) {
        return a.title.localeCompare(b.title, 'zh-CH') || a.id - b.id;
    } else if (sort === TodoListSortEnum.NAME_DESC) {
        return b.title.localeCompare(a.title, 'zh-CH') || a.id - b.id;
    } else if (sort === TodoListSortEnum.CREATE_TIME_ASC) {
        return a.id - b.id;
    } else if (sort === TodoListSortEnum.CREATE_TIME_DESC) {
        return b.id - a.id;
    }
    return a.priority - b.priority || a.id - b.id;
}


export const useTodoStore = defineStore('todo', {
    state: () => ({
        // 当前选择的分类
        categoryId: 0,
        // 当前打开的清单
        id: 0,
        todoItems: new Array<TodoItemIndex>(),
        rev: undefined as string | undefined,
        collapsed: false,
        itemId: 0,
        todoListSort: getItemByDefault<TodoListSortEnum>(LocalNameEnum.KEY_TODO_LIST_SORT, TodoListSortEnum.PRIORITY)
    }),
    getters: {
        title: state => {
            if (state.categoryId === 0) {
                return '请选择清单';
            }
            const category = useTodoCategoryStore().todoCategoryMap.get(state.categoryId);
            if (category) {
                return category.name;
            }
            return '请选择清单';
        },
        todoList: (state): Array<TodoItemIndex> => {
            return state.todoItems
                .filter(e => e.status === TodoItemStatus.TODO)
                .sort((a, b) => sortTodoIndex(a, b, state.todoListSort));
        },
        completeList: (state): Array<TodoItemIndex> => {
            return state.todoItems.filter(e => e.status === TodoItemStatus.COMPLETE).sort((a, b) => a.id - b.id);
        }
    },
    actions: {
        switchCollapsed() {
            this.collapsed = !this.collapsed;
        },
        setCategoryId(categoryId: number) {
            this.categoryId = categoryId;
            this.itemId = 0;
        },
        setId(id: number) {
            this.id = id;
            if (id === 0) {
                this.todoItems = new Array<TodoItemIndex>();
            } else {
                useGlobalStore().startLoading("正在获取待办项");
                listByAsync<TodoItemIndex>(LocalNameEnum.TODO_CATEGORY + id)
                    .then(items => {
                        this.todoItems = items.list;
                        this.rev = items.rev;
                    })
                    .catch(e => MessageUtil.error("获取待办项失败", e))
                    .finally(() => useGlobalStore().closeLoading());
            }
        },
        setItemId(itemId: number) {
            this.itemId = itemId;
        },
        setTodoListSort(todoListSort: TodoListSortEnum) {
            this.todoListSort = todoListSort;
            setItem<TodoListSortEnum>(LocalNameEnum.KEY_TODO_LIST_SORT, this.todoListSort);
        },
        async addSimple(title: string) {
            if (title.trim() === '') {
                return Promise.reject("请输入内容");
            }
            if (this.id === 0) {
                return Promise.reject("请选择清单");
            }
            const id = new Date().getTime();
            const item: TodoItemIndex = {
                ...getDefaultTodoItemIndex(id),
                title
            };
            // 新增到当前列表
            this.todoItems.push(item);
            // 同步
            this.rev = await saveListByAsync(LocalNameEnum.TODO_CATEGORY + this.id, this.todoItems, this.rev);
            // 新增内容
            await saveOneByAsync<TodoItemContent>(LocalNameEnum.TODO_ITEM + id, getDefaultTodoItemContent(id));
        },
        async getTodoItem(id: number): Promise<TodoItem> {
            if (id === 0) {
                return Promise.reject("待办项不存在");
            }
            const index = this.todoItems.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("待办项不存在");
            }
            const todoItem = this.todoItems[index];
            const content = await getFromOneByAsync(
                LocalNameEnum.TODO_ITEM + todoItem.id,
                getDefaultTodoItemContent(todoItem.id));
            return Promise.resolve({
                index: clone(todoItem),
                content: content
            });
        },
        /**
         * 根据ID更新待办项
         * @param id 待办项ID
         * @param record 更新内容
         * @return 更新后的数据
         */
        async updateById(id: number, record: Partial<TodoItemIndex>): Promise<TodoItemIndex> {
            const index = this.todoItems.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("待办项不存在");
            }
            this.todoItems[index] = {
                ...this.todoItems[index],
                ...record,
                updateTime: new Date(),
            };
            // 同步
            this.rev = await saveListByAsync(LocalNameEnum.TODO_CATEGORY + this.id, this.todoItems, this.rev);
            return Promise.resolve(this.todoItems[index]);
        },
        async removeById(id: number) {
            const index = this.todoItems.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("待办项不存在");
            }
            let splice = this.todoItems.splice(index, 1);
            // 同步
            this.rev = await saveListByAsync(LocalNameEnum.TODO_CATEGORY + this.id, this.todoItems, this.rev);
            // 删除内容
            await removeOneByAsync(LocalNameEnum.TODO_ITEM + splice[0].id, true);
            if (this.itemId === id) {
                this.itemId = 0;
            }
        }
    }
})
