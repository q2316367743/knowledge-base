import {listToTree, TodoCategory, TodoCategoryRecord, TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import {defineStore} from "pinia";
import {listByAsync, removeOneByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/lang/ArrayUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {useTodoStore} from "@/store/components/TodoStore";
import {listFeature, removeFeatureOne, setFeatureOneSimple} from "@/utils/utools/FeatureUtil";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";

export const useTodoCategoryStore = defineStore('todo-category', {
    state: () => ({
        value: new Array<TodoCategory>(),
        rev: undefined as string | undefined,
        featureKeys: new Set<string>()
    }),
    getters: {
        todoCategoryTree: state => listToTree(state.value),
        todoCategoryMap: state => map<TodoCategory, number, 'id'>(state.value, 'id')
    },
    actions: {
        async init() {
            const res = await listByAsync<TodoCategory>(LocalNameEnum.LOCAL_TODO_CATEGORY);
            this.value = res.list;
            this.rev = res.rev;
            this.featureKeys = new Set<string>(listFeature(Constant.feature.TODO_CATEGORY, this.value.map(r => r.id)));
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.LOCAL_TODO_CATEGORY, this.value, this.rev);
            this.featureKeys = new Set<string>(listFeature(Constant.feature.TODO_CATEGORY, this.value.map(r => r.id)));
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
        rename(id: number, newName: string) {
            return this.update(id, {name: newName});
        },
        async update(id: number, source: Partial<TodoCategory>) {
            const index = this.value.findIndex(v => v.id === id);
            if (index === -1) {
                return Promise.reject("该分类不存在");
            }
            this.value[index] = {
                ...this.value[index],
                ...source,
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
            // 删除快捷访问
            if (this.hasFeature(id)) {
                this.removeFeature(id);
            }
        },
        async drop(id: number, pid: number) {
            const index = this.value.findIndex(v => v.id === id);
            if (index === -1) {
                return Promise.reject("待办分类不存在");
            }
            this.value[index] = {
                ...this.value[index],
                pid: pid,
                updateTime: new Date()
            }
            await this._sync();
        },
        hasFeature(id: number) {
            return this.featureKeys.has(Constant.feature.TODO_CATEGORY + id);
        },
        addFeature(id: number) {
            const index = this.value.findIndex(v => v.id === id);
            if (index === -1) {
                MessageUtil.error("该分类不存在");
                return;
            }
            const feature = Constant.feature.TODO_CATEGORY + id;
            setFeatureOneSimple(feature, this.value[index].name);
            this.featureKeys.add(feature);
        },
        removeFeature(id: number) {
            const feature = Constant.feature.TODO_CATEGORY + id;
            removeFeatureOne(feature);
            this.featureKeys.delete(feature);
        }
    }
})
