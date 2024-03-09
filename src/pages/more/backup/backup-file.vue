<template>
    <div>
        <a-alert title="文件备份设置">通过文件进行备份</a-alert>
        <a-button-group type="primary" style="margin: 14px 0;">
            <a-button :loading="loading.exec" @click="execFileBackup()">执行备份</a-button>
            <a-button :loading="loading.load" @click="restoreByFile()" status="success">
                恢复备份
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {getDefaultBackupSetting, useBackupSettingStore} from "@/store/db/BackupSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import JSZip from "jszip";
import {download} from "@/utils/BrowserUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {toDateString} from "xe-utils";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import {useFileSystemAccess} from "@vueuse/core";
import {listRecordByAsync, removeOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import updateCheck from "@/components/update-check/UpdateCheck";
import {buildBackup, restoreBackup} from "@/pages/more/backup/func";


const FOLDER = Constant.id;

const notBackup = new Set<string>();
notBackup.add(LocalNameEnum.SETTING_BACKUP);

const instance = ref({
    visible: false,
    loading: false,
    record: getDefaultBackupSetting()
});
const loading = ref({
    exec: false,
    load: false
})
const backupSetting = computed(() => useBackupSettingStore().backupSetting);
instance.value.record = Object.assign(instance.value.record, backupSetting.value);

function save() {
    instance.value.loading = true;
    useBackupSettingStore().save(instance.value.record)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e))
        .finally(() => instance.value.loading = false);
}


// -------------------------------------- 文件备份 --------------------------------------

function execFileBackup() {
    loading.value.exec = true;
    buildBackup()
        .then(content => {
            download(content,
                FOLDER + "|" + toDateString(new Date(), "yyyy-MM-dd_HH_mm_ss") + ".zip",
                "application/zip");
            MessageUtil.success("备份完成");
        }).catch(e => MessageUtil.error("备份失败", e))
        .finally(() => loading.value.exec = false);
}

const {isSupported, open, data} = useFileSystemAccess({
    dataType: 'ArrayBuffer',
    types: [{
        description: "ZIP文件",
        accept: {
            "application/zip": ['.zip']
        }
    }]
});

function restoreByFile() {
    if (!isSupported.value) {
        MessageUtil.error("您的浏览器版本不支持showOpenFilePicker方法，无法使用文件备份");
        return;
    }
    loading.value.load = true;
    _restoreByFile()
        .then(() => {
            MessageUtil.success("恢复成功");
            // 重新初始化数据
            import('@/global/BeanFactory').then(data => {
                useGlobalStore().startLoading("开始初始化数据...");
                // 检查更新、执行更新
                updateCheck().catch(e => MessageUtil.error("更新失败", e))
                        .finally(() =>
                                data.initData().catch(e => MessageUtil.error("数据初始化失败", e))
                                        .finally(() => useGlobalStore().closeLoading()))
            });

        })
        .catch(e => {
            if ((e + '') === 'AbortError: The user aborted a request.') {
                return;
            }
            MessageUtil.error("恢复失败", e);
        })
        .finally(() => loading.value.load = false);
}

async function _restoreByFile() {
    await (open() as Promise<void>);
    if (!data.value) {
        return Promise.reject("未选择文件");
    }
    await restoreBackup(data.value);
}

</script>
<style scoped>
</style>
