import {defineStore} from "pinia";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getDefaultWorkspaceSetting, WorkspaceSetting} from "@/entity/setting/WorkspaceSetting";

export const useWorkspaceSettingStore = defineStore('workspace-setting', {
    state: () => ({
        setting: getDefaultWorkspaceSetting(),
        rev: undefined as undefined | string,
    }),
    getters: {
        customerMarkdown: state => state.setting.customerMarkdown,
        markdownEditOnly: state => state.setting.markdownEditOnly,
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_WORKSPACE, this.setting);
            this.setting = res.record;
            this.rev = res.rev;
        },
        async save(setting: WorkspaceSetting) {
            this.setting = setting;
            this.rev = await saveOneByAsync(LocalNameEnum.SETTING_WORKSPACE, this.setting, this.rev);
        },
    }
})
