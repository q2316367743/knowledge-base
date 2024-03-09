import Category from "@/entity/Category";
import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {clone} from "xe-utils";
import {listToTree} from "@/entity/ListTree";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";


export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: new Array<Category>(),
        rev: undefined as string | undefined
    }),
    getters: {
        categoryTree: (state) => listToTree(state.categories, "全部分类")
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.CATEGORY, new Array<Category>());
            this.categories = res.record;
            this.rev = res.rev
        },
        async add(pid: number) {
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
                name,
                pid
            });
            await this._sync();
        },
        async update(id: number) {
            const index = this.categories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject(`分类【${id}】不存在`);
            }
            const name = await MessageBoxUtil.prompt("请输入分类名", "重命名", {
                confirmButtonText: "更新",
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
        async save(categories: Array<Category>) {
            this.categories = categories;
            await this._sync();
        },
        async drop(id: number, pid: number) {
            for (let category of this.categories) {
                if (category.id === id) {
                    category.pid = pid;
                    await this._sync();
                    return Promise.resolve();
                }
            }
            return Promise.reject("未找到分类【" + id + "】");
        },
        async _sync() {
            this.rev = await saveOneByAsync(LocalNameEnum.CATEGORY, clone(this.categories, true), this.rev);
        }
    }
})
