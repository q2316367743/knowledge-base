import {defineStore} from "pinia";
import {Folder} from "@/entity/folder";
import {listToTree} from "@/entity/ListTree";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {group, map} from "@/utils/lang/ArrayUtil";

export const useFolderStore = defineStore('folder', {
    state: () => ({
        folders: new Array<Folder>(),
        rev: undefined as string | undefined
    }),
    getters: {
        folderTree: state => listToTree(state.folders, "全部文件夹"),
        folderIds: state => state.folders.map(folder => folder.id),
        folderMap: state => map(state.folders, 'id'),
        folderGroupMap: state => group(state.folders, 'pid')
    },
    actions: {
        async init() {
            const res = await listByAsync<Folder>(LocalNameEnum.FOLDER);
            this.folders = res.list;
            this.rev = res.rev
        },
        async _sync() {
            this.rev = await saveListByAsync<Folder>(LocalNameEnum.FOLDER, this.folders, this.rev);
        },
        async addFolder(pid: number, name: string) {
            const now = new Date();
            const folder = {
                id: now.getTime(),
                createTime: now,
                updateTime: now,
                name: name,
                pid: pid
            };
            this.folders.push(folder);
            await this._sync();
            return folder
        },
        async removeFolder(id: number) {
            const index = this.folders.findIndex(folder => folder.id === id);
            if (index == -1) {
                return Promise.reject(`文件夹【${id}】不存在`)
            }
            this.folders.splice(index, 1);
            await this._sync();
        },
        async renameFolder(id: number, name: string) {
            const index = this.folders.findIndex(folder => folder.id === id);
            if (index == -1) {
                return Promise.reject(`文件夹【${id}】不存在`)
            }
            this.folders[index] = {
                ...this.folders[index],
                name: name,
                updateTime: new Date()
            }
            await this._sync();
        },
        async drop(id: number, pid: number) {
            const index = this.folders.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("文件夹未找到，请刷新后重试！");
            }
            this.folders[index] = {
                ...this.folders[index],
                pid: pid,
                updateTime: new Date(),
            }
            // 同步
            await this._sync();
        },
        async updateMulti(folders: Array<Partial<Folder> & {id: number}>) {
            for (let folder of folders) {
                const index = this.folders.findIndex(e => e.id === folder.id);
                if (index === -1) {
                    continue;
                }
                // 新增索引
                this.folders[index] = {
                    ...this.folders[index],
                    ...folder,
                    updateTime: new Date(),
                };
            }
            // 同步
            await this._sync();
        }
    }
})
