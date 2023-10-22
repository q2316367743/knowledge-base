import {defineStore} from "pinia";
import BackupSetting from "@/entity/setting/BackupSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";


export function getDefaultBackupSetting(): BackupSetting {
    return {
        url: '',
        username: '',
        password: ''
    }
}


export const useBackupSettingStore = defineStore('backup-setting', {
    state: () => ({
        backupSetting: getDefaultBackupSetting(),
        rev: undefined as string | undefined
    }),
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_BACKUP, getDefaultBackupSetting());
            this.backupSetting = Object.assign(this.backupSetting, res.record);
            this.rev = res.rev;
        },
        async save(backupSetting: BackupSetting) {
            this.backupSetting = backupSetting;
            this.rev = await saveOneByAsync( LocalNameEnum.SETTING_BACKUP, this.backupSetting, this.rev);
        }
    }
})
