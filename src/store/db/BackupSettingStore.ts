import {defineStore} from "pinia";
import BackupSetting from "@/entity/setting/BackupSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ref} from "vue";
import {useAsyncDebounce} from "@/hooks/AsyncDebounce";


export function getDefaultBackupSetting(): BackupSetting {
  return {
    url: '',
    username: '',
    password: ''
  }
}

export const useBackupSettingStore = defineStore('backup-setting', () => {
  const backupSetting = ref(getDefaultBackupSetting());
  let rev = undefined as string | undefined;

  async function init() {
    const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_BACKUP, getDefaultBackupSetting());
    backupSetting.value = Object.assign(backupSetting.value, res.record);
    rev = res.rev;
  }

  init()
    .then(() => console.log('BackupSettingStore init success'))
    .catch(() => console.error('BackupSettingStore init failed'));

  const _sync = useAsyncDebounce(async () => {
    rev = await saveOneByAsync(LocalNameEnum.SETTING_BACKUP, backupSetting.value, rev);
  }, 300);

  async function save(res: BackupSetting) {
    backupSetting.value = res;
    _sync()
  }

  return {
    backupSetting, save
  }
})
