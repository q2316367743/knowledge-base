import JSZip from "jszip";
import {listRecordByAsync, removeOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const notBackup = new Set<string>();
notBackup.add(LocalNameEnum.SETTING_BACKUP);

/**
 * 恢复备份
 * @param backup 备份文件
 */
export async function restoreBackup(backup: ArrayBuffer): Promise<void> {
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
        await saveOne(path, blob);
    }
}

function saveOne(key: string, value: Blob): Promise<void> {
    const fileReader = new FileReader();
    fileReader.readAsText(value, 'utf-8');

    return new Promise<void>((resolve, reject) => {
        fileReader.onload = async () => {
            if (!fileReader.result) {
                reject("文件读取失败：" + key);
                return;
            }
            const data = JSON.parse(fileReader.result as string);
            const id = data.id;
            const record = data.record;
            await saveOneByAsync<any>(id, record);
            resolve();
        };
        fileReader.onerror = reject;
    });
}

/**
 * 构建备份文件
 */
export async function buildBackup(): Promise<ArrayBuffer> {
    const zip = new JSZip();
    const items = await listRecordByAsync<any>();
    for (let item of items) {
        // 备份时，全部备份
        zip.file(item.id, JSON.stringify(item));
    }
    return await zip.generateAsync({type: "arraybuffer"});
}
