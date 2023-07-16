import Category from "@/entity/Category";
import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {toRaw} from "vue";

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: new Array<Category>(),
        rev: undefined as string | undefined
    }),
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.CATEGORY);
            if (res) {
                this.categories = res.value;
                this.rev = res._rev
            }
        },
        async add() {
            const name = await MessageBoxUtil.prompt("请输入分类名", "新增分类", {
                confirmButtonText: "新增",
                cancelButtonText: "取消"
            });
            const now = new Date();
            const id = now.getTime();
            this.categories.push({
                id,
                createTime: now,
                updateTime: now,
                name
            });
            await this._sync();
        },
        async update(id: number) {
            const index = this.categories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject(`分类【${id}】不存在`);
            }
            const name = await MessageBoxUtil.prompt("请输入分类名", "修改分类", {
                confirmButtonText: "新增",
                cancelButtonText: "取消",
                inputValue: this.categories[index].name
            });
            this.categories[index] = {
                ...this.categories[index],
                name,
                updateTime: new Date()
            };
            await this._sync();
        },
        async remove(id: number) {
            const index = this.categories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject(`分类【${id}】不存在`);
            }
            this.categories.splice(index, 1);
            await this._sync();
        },
        async _sync() {
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.CATEGORY,
                _rev: this.rev,
                value: toRaw(this.categories)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        }
    }
})
