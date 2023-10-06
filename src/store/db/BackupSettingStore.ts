import {defineStore} from "pinia";
import BackupSetting from "@/entity/setting/BackupSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import {useAuthStore} from "@/store/components/AuthStore";


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
            const res = await useAuthStore().authDriver.get(LocalNameEnum.SETTING_BACKUP);
            if (res) {
                this.backupSetting = Object.assign(this.backupSetting, res.value);
                this.rev = res._rev;
            }else {
                this.backupSetting = getDefaultBackupSetting();
                this.rev = undefined;
            }
        },
        async save(backupSetting: BackupSetting) {
            this.backupSetting = backupSetting;
            const res = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.SETTING_BACKUP,
                _rev: this.rev,
                value: toRaw(this.backupSetting)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        }
    }
})
