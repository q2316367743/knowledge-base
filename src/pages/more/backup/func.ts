import JSZip from "jszip";
import {
  getAttachmentByAsync,
  listRecordByAsync,
  removeOneByAsync,
  saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {postAttachment} from "@/utils/utools/AttachmentUtil";

/**
 * 恢复备份
 * @param backup 备份文件
 */
export async function restoreBackup(backup: ArrayBuffer): Promise<void> {
  const zip = await JSZip.loadAsync(backup);

  // 删除全部记录
  const oldFiles = await listRecordByAsync<any>();
  for (let oldFile of oldFiles) {
    await removeOneByAsync(oldFile.id, true);
  }

  let index = 0;
  for (let path in zip.files) {
    const file = zip.file(path);
    if (!file) {
      index += 1;
      continue;
    }
    const blob = await file.async('blob');
    await saveOne(path, blob);
  }
}

/**
 * 保存单个记录-文本
 * @param key
 * @param value
 */
function saveOneWithText(key: string, value: Blob): Promise<void> {
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
 * 保存单个记录附件
 */
async function saveOneWithFile(docId: string, attachment: Blob): Promise<any> {
  const buffer = await attachment.arrayBuffer();
  const res = await postAttachment(docId, new Uint8Array(buffer), "application/octet-stream");
  if (res.error) {
    return Promise.reject(res.message);
  }
  return Promise.resolve("attachment:" + docId);
}

function saveOne(key: string, value: Blob): Promise<void> {
  if (key.startsWith(LocalNameEnum.ARTICLE_ATTACHMENT)) {
    // 这是个附件
    return saveOneWithFile(key, value);
  } else {
    // 不是附件
    return saveOneWithText(key, value);
  }
}

/**
 * 构建备份文件
 */
export async function buildBackup(): Promise<ArrayBuffer> {
  const zip = new JSZip();
  const items = await listRecordByAsync<any>();
  for (let item of items) {
    if (item.id.startsWith(LocalNameEnum.ARTICLE_ATTACHMENT)) {
      // 这是个附件
      const attachment = await getAttachmentByAsync(item.id);
      if (attachment) {
        zip.file(item.id, attachment);
      }
    } else {
      // 不是附件
      zip.file(item.id, JSON.stringify(item));
    }
  }
  return await zip.generateAsync({type: "arraybuffer"});
}
