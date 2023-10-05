import {defineStore} from "pinia";
import {Folder} from "@/entity/folder";
import {listToTree} from "@/entity/ListTree";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";

export const useFolderStore = defineStore('folder', {
    state: () => ({
        folders: new Array<Folder>(),
        rev: undefined as string | undefined
    }),
    getters: {
        folderTree: state => listToTree(state.folders, "全部文件夹")
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
            this.folders.push({
                id: now.getTime(),
                createTime: now,
                updateTime: now,
                name: name,
                pid: pid
            });
            await this._sync();
        }
    }
})
