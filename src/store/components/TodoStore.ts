import {defineStore} from "pinia";
import {
    getDefaultTodoItemAttr,
    getDefaultTodoItemContent,
    getDefaultTodoItemIndex,
    TodoItem,
    TodoItemAttr,
    TodoItemContent,
    TodoItemIndex,
    TodoItemStatus
} from "@/entity/todo/TodoItem";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {
    DbRecord,
    getFromOneWithDefaultByAsync,
    listByAsync, listRecordByAsync,
    removeOneByAsync,
    saveListByAsync,
    saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {clone} from "xe-utils";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {ArticleIndex} from "@/entity/article";
import {useArticleStore} from "@/store/db/ArticleStore";
import {TodoListLayoutEnum} from "@/entity/todo/TodoCategory";
import {map} from "@/utils/lang/ArrayUtil";

export function sortTodoIndex(a: TodoItemIndex, b: TodoItemIndex, sort: TodoListSortEnum): number {
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
        // 当前选择的分类，如果是文件夹，下面的就是0
        categoryId: 0,
        // 当前打开的清单
        id: 0,
        // 当前打开清单的所有待办项
        todoItems: new Array<TodoItemIndex>(),
        todoArticles: new Array<number>(),
        todoArticlesRev: undefined as string | undefined,
        rev: undefined as string | undefined,
        sort: TodoListSortEnum.PRIORITY as TodoListSortEnum,
        layout: TodoListLayoutEnum.DEFAULT as TodoListLayoutEnum,
        hides: new Array<string>(),
        // 收起状态
        collapsed: false,
        // 当前选择的待办项
        itemId: 0,
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
            return state.todoItems.filter(e => e.status === TodoItemStatus.TODO);
        },
        completeList: (state): Array<TodoItemIndex> => {
            return state.todoItems.filter(e => e.status === TodoItemStatus.COMPLETE).sort((a, b) => a.id - b.id);
        },
        abandonList: (state): Array<TodoItemIndex> => {
            return state.todoItems.filter(e => e.status === TodoItemStatus.ABANDON).sort((a, b) => a.id - b.id);
        },
        articleList: (state): Array<ArticleIndex> => {
            if (state.todoArticles.length === 0) {
                return new Array<ArticleIndex>();
            }
            const items = new Array<ArticleIndex>();
            for (let todoArticle of state.todoArticles) {
                const articleIndex = useArticleStore().articleMap.get(todoArticle);
                if (articleIndex) {
                    items.push(articleIndex);
                }
            }
            return items

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
            if (this.id !== id || id === 0) {
                // 只要切换ID或者id为0
                this.id = id;
                this.todoItems = new Array<TodoItemIndex>();
                this.todoArticles = new Array<number>();
                this.todoArticlesRev = undefined;
                this.itemId = 0;
            }
            if (id > 0) {
                const todoCategory = map(useTodoCategoryStore().value, 'id').get(id);
                if (!todoCategory) {
                    MessageUtil.error("待办分类不存在，请刷新页面重试");
                    this.id = 0;
                    return;
                }
                // 只要ID大于0，这几项就要刷新
                this.sort = TodoListSortEnum.PRIORITY;
                this.layout = TodoListLayoutEnum.DEFAULT;
                this.hides = new Array<string>();
                useGlobalStore().startLoading("正在获取待办项");
                this.layout = todoCategory.todoListLayout || TodoListLayoutEnum.DEFAULT;
                this.sort = todoCategory.todoListSort || TodoListSortEnum.PRIORITY;
                todoCategory.hideOfTodo && this.hides.push('1');
                todoCategory.hideOfComplete && this.hides.push('2');
                todoCategory.hideOfAbandon && this.hides.push('3');
                todoCategory.hideOfArticle && this.hides.push('4');
                listByAsync<TodoItemIndex>(LocalNameEnum.TODO_CATEGORY + id)
                    .then(items => {
                        this.todoItems = items.list;
                        this.rev = items.rev;
                    })
                    .catch(e => MessageUtil.error("获取待办项失败", e))
                    .finally(() => useGlobalStore().closeLoading());
                getFromOneWithDefaultByAsync<Array<number>>(LocalNameEnum.TODO_ARTICLE + id, new Array<number>())
                    .then(articles => {
                        this.todoArticles = articles.record;
                        this.todoArticlesRev = articles.rev;
                    })
                    .catch(e => MessageUtil.error("获取待办关联文章失败", e))
                    .finally(() => useGlobalStore().closeLoading());
            }
        },
        setItemId(itemId: number) {
            this.itemId = itemId;
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.TODO_CATEGORY + this.id, this.todoItems, this.rev);
        },
        async addSimple(record: Partial<TodoItemIndex>, attr?: Partial<TodoItemAttr>) {
            if (!record.title) {
                return Promise.reject("请输入内容");
            }
            if (record.title.trim() === '') {
                return Promise.reject("请输入内容");
            }
            if (this.id === 0) {
                return Promise.reject("请选择清单");
            }
            const id = new Date().getTime();
            const item: TodoItemIndex = {
                ...getDefaultTodoItemIndex(id),
                ...record
            };
            if (attr) {
                // 由于数据量不大，就直接查询
                let old = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
                // 如果存在内容，则一并更新
                await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + id, {
                    ...old.record,
                    ...attr
                }, old.rev);
            }
            // 新增内容
            await saveOneByAsync<TodoItemContent>(LocalNameEnum.TODO_ITEM + id, getDefaultTodoItemContent(id));
            // 新增到当前列表
            this.todoItems.push(item);
            // 同步
            await this._sync();
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
            const content = await getFromOneWithDefaultByAsync(
                LocalNameEnum.TODO_ITEM + todoItem.id,
                getDefaultTodoItemContent(todoItem.id));
            // 内容备份
            return Promise.resolve({
                index: clone(todoItem),
                content: content,
                attr: await this.getTodoItemAttr(id)
            });
        },
        async getTodoItemAttr(id: number): Promise<TodoItemAttr> {
            if (id === 0) {
                return Promise.reject("待办项不存在");
            }
            const index = this.todoItems.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("待办项不存在");
            }
            let attrDbRecord = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
            return Promise.resolve(attrDbRecord.record);
        },
        async getMultiTodoItemAttr(ids: Array<number>): Promise<Array<DbRecord<TodoItemAttr>>> {
            return listRecordByAsync(ids.map(id => LocalNameEnum.TODO_ATTR + id))
        },
        /**
         * 根据ID更新待办项
         * @param id 待办项ID
         * @param record 更新内容
         * @param attr 待办属性
         * @return 更新后的数据
         */
        async updateById(id: number, record: Partial<TodoItemIndex>, attr?: Partial<TodoItemAttr>): Promise<TodoItemIndex> {
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
            await this._sync();
            if (attr) {
                // 由于数据量不大，就直接查询
                let old = await getFromOneWithDefaultByAsync(LocalNameEnum.TODO_ATTR + id, getDefaultTodoItemAttr(id));
                // 如果存在内容，则一并更新
                await saveOneByAsync<TodoItemAttr>(LocalNameEnum.TODO_ATTR + id, {
                    ...old.record,
                    ...attr
                }, old.rev);
            }
            return Promise.resolve(this.todoItems[index]);
        },
        async saveContent(id: number, content: TodoItemContent, rev?: string): Promise<string | undefined> {
            return saveOneByAsync(LocalNameEnum.TODO_ITEM + id, content, rev)
        },
        async removeById(id: number) {
            const index = this.todoItems.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("待办项不存在");
            }
            this.todoItems.splice(index, 1);
            // 同步
            await this._sync();
            // 删除内容
            await removeOneByAsync(LocalNameEnum.TODO_ITEM + id, true);
            // 删除属性
            await removeOneByAsync(LocalNameEnum.TODO_ATTR + id, true)
            if (this.itemId === id) {
                this.itemId = 0;
            }
        },
        async associationArticle(ids: Array<number>) {
            this.todoArticles = ids;
            if (this.id === 0) {
                return;
            }
            this.todoArticlesRev = await saveOneByAsync<Array<number>>(
                LocalNameEnum.TODO_ARTICLE + this.id,
                this.todoArticles,
                this.todoArticlesRev);
        }
    }
})
