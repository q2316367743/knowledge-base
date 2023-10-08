import {defineStore} from "pinia";
import {TodoItem} from "@/entity/todo/TodoItem";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {DbRecord, listRecordByAsync} from "@/utils/utools/DbStorageUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";

export const useTodoStore = defineStore('todo', {
    state: () => ({
        categoryId: 0,
        id: 0,
        todoItems: new Array<DbRecord<TodoItem>>(),
        collapsed: false
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
        itemMap: state => {
            // 处理数据
            const todoMap = new Map<number, Array<DbRecord<TodoItem>>>();

            // 分类
            state.todoItems.forEach(e => {
                let list = todoMap.get(e.record.status);
                if (!list) {
                    list = new Array<DbRecord<TodoItem>>();
                }
                list.push(e);
                todoMap.set(e.record.status, list);
            });

            // 排序
            for (let key of todoMap.keys()) {
                let list = todoMap.get(key);
                if (list) {
                    // 排序
                    list.sort((a, b) => {
                        if (a.record.top) {
                            return 1;
                        }
                        if (b.record.top) {
                            return -1;
                        }
                        return a.record.id - b.record.id;
                    })
                }
            }
            return todoMap;
        }
    },
    actions: {
        switchCollapsed() {
            this.collapsed = !this.collapsed;
        },
        setCategoryId(categoryId: number) {
            this.categoryId = categoryId;
        },
        setId(id: number) {
            this.id = id;
            if (id === 0) {
                this.todoItems = new Array<DbRecord<TodoItem>>();
            } else {
                useGlobalStore().startLoading("正在获取待办项");
                listRecordByAsync<TodoItem>(LocalNameEnum.TODO_ITEM + id)
                    .then(items => this.todoItems = items)
                    .catch(e => MessageUtil.error("获取待办项失败", e))
                    .finally(() => useGlobalStore().closeLoading());
            }
        },
    }
})
