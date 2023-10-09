import {listToTree, TodoCategory, TodoCategoryRecord, TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import {defineStore} from "pinia";
import {listByAsync, removeOneByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/ArrayUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {useTodoStore} from "@/store/components/TodoStore";

export const useTodoCategoryStore = defineStore('todo-category', {
    state: () => ({
        value: new Array<TodoCategory>(),
        rev: undefined as string | undefined
    }),
    getters: {
        todoCategoryTree: state => listToTree(state.value),
        todoCategoryMap: state => map<TodoCategory, number, 'id'>(state.value, 'id')
    },
    actions: {
        async init() {
            const res = await listByAsync(LocalNameEnum.LOCAL_TODO_CATEGORY);
            this.value = res.list;
            this.rev = res.rev;
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.LOCAL_TODO_CATEGORY, this.value, this.rev);
        },
        async add(record: TodoCategoryRecord) {
            const now = new Date();
            const id = now.getTime();
            this.value.push({
                ...record,
                id: id,
                createTime: now,
                updateTime: now
            });
            await this._sync();
        },
        async rename(id: number, newName: string) {
            const index = this.value.findIndex(v => v.id === id);
            if (index === -1) {
                return Promise.reject("该分类不存在");
            }
            this.value[index] = {
                ...this.value[index],
                name: newName,
                updateTime: new Date()
            }
            await this._sync();
        },
        async remove(id: number) {
            const index = this.value.findIndex(v => v.id === id);
            if (index === -1) {
                return Promise.reject("该分类不存在");
            }
            // 看看这个下面有没有子分类
            const sub = this.value.findIndex(v => v.pid === id);
            if (sub > -1) {
                return Promise.reject("该文件夹下存在其他清单，请删除全部清单后再删除此文件夹");
            }
            // 删除
            let splice = this.value.splice(index, 1);
            await this._sync();
            // 如果是清单，还要删除待办
            if (splice[0].type === TodoCategoryTypeEnum.TODO) {
                const items = await listByAsync<TodoItemIndex>(LocalNameEnum.TODO_CATEGORY + id);
                for (let item of items.list) {
                    // 删除内容
                    await removeOneByAsync(LocalNameEnum.TODO_ITEM + item.id, true);
                }
                // 删除列表
                await removeOneByAsync(LocalNameEnum.TODO_CATEGORY + id, true);
            }
            if (useTodoStore().categoryId === id) {
                useTodoStore().setCategoryId(0);
                useTodoStore().setId(0);
            }
        }
    }
})
