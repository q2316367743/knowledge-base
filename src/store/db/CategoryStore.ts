import Category from "@/entity/Category";
import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {clone} from "xe-utils";

export interface CategoryTree {

    key: number;

    title: string;

    children: Array<CategoryTree>;

}

function listToTree(categories: Array<Category>): Array<CategoryTree> {
    const base: Array<CategoryTree> = categories.filter(c => c.pid === 0 || !c.pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: []
        }));
    base.forEach(item => _listToTree(item, item.key, categories));
    return [{
        key: 0,
        title: "全部分类",
        children: base
    }];
}

function _listToTree(tree: CategoryTree, pid: number, categories: Array<Category>) {
    tree.children = categories.filter(c => c.pid === pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: []
        }));
    tree.children.forEach(item => _listToTree(item, item.key, categories));
}

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: new Array<Category>(),
        rev: undefined as string | undefined
    }),
    getters: {
        categoryTree: (state) => listToTree(state.categories)
    },
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.CATEGORY);
            if (res) {
                this.categories = res.value;
                this.rev = res._rev
            }
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
            const name = await MessageBoxUtil.prompt("请输入分类名", "修改分类名称", {
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
            for(let category of this.categories) {
                if (category.id === id) {
                    category.pid = pid;
                    await this._sync();
                    return Promise.resolve();
                }
            }
            return Promise.reject("未找到分类【" + id + "】");
        },
        async _sync() {
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.CATEGORY,
                _rev: this.rev,
                value: clone(this.categories, true)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        }
    }
})
