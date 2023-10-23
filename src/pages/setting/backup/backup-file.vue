<template>
    <div class="backup">
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
import MessageUtil from "@/utils/MessageUtil";
import JSZip from "jszip";
import {download} from "@/utils/BrowserUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {toDateString} from "xe-utils";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import {useFileSystemAccess} from "@vueuse/core";
import {initData} from "@/global/BeanFactory";
import {listRecordByAsync, removeOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";


const FOLDER = Constant.id;

const notBackup = new Set<string>();
notBackup.add(LocalNameEnum.SETTING_BACKUP);
notBackup.add(LocalNameEnum.VERSION);

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

// -------------------------------------- 基础方法 --------------------------------------

async function buildBackup(): Promise<ArrayBuffer> {
    const zip = new JSZip();
    const items = await listRecordByAsync<any>();
    for (let item of items) {
        // 备份时，全部备份
        zip.file(item.id, JSON.stringify(item));
    }
    return await zip.generateAsync({type: "arraybuffer"});
}

/**
 * 恢复备份
 * @param backup 备份文件
 */
async function restoreBackup(backup: ArrayBuffer): Promise<void> {
    const zip = await JSZip.loadAsync(backup);

    // 删除当前存储
    const oldFiles = await listRecordByAsync<any>();
    for (let oldFile of oldFiles) {
        if (notBackup.has(oldFile.id)) {
            continue;
        }
        // 删除时有选择删除
        await removeOneByAsync(oldFile.id, true);
    }

    return new Promise<void>(async resolve => {
        const len = Object.keys(zip.files).length;
        let index = 0;
        for (let path in zip.files) {
            if (notBackup.has(path)) {
                // 恢复时，有选择恢复
                index += 1;
                continue;
            }
            const file = zip.file(path);
            if (!file) {
                index += 1;
                continue;
            }
            const blob = await file.async('blob');
            const fileReader = new FileReader();

            fileReader.readAsText(blob, 'utf-8');

            fileReader.onload = async () => {
                index += 1;
                if (!fileReader.result) {
                    MessageUtil.warning("文件读取失败", path);
                    if (index >= len) {
                        resolve();
                    }
                    return;
                }
                await saveOneByAsync<any>(path, JSON.parse(fileReader.result as string).value);
                if (index >= len) {
                    resolve();
                }
            }
        }
    });
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
            useGlobalStore().startLoading("开始初始化数据...");
            initData()
                .then(() => MessageUtil.success("数据初始化成功"))
                .catch(e => MessageUtil.error("数据初始化失败", e))
                .finally(() => useGlobalStore().closeLoading());
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
.backup {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;
    overflow: auto;
}
</style>
