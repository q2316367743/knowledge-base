import {useSnowflake} from "@/hooks/Snowflake";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {renderAttachmentUrlByUTools} from "@/plugin/server";
import {basename, extname} from "@/utils/file/FileUtil";
import {getPlatform, requestRemoteApi} from '@/utils/utools/common';
import {appDataDir, join} from '@tauri-apps/api/path';
import {BaseDirectory, exists, mkdir, readDir, writeFile, remove} from '@tauri-apps/plugin-fs';
import {convertFileSrc} from '@tauri-apps/api/core';

const TAURI_ATTACHMENT = "attachment";

export interface FileUploadResult {
  // 文件名
  name: string;
  // 文件key，在markdown文档中有效
  key: string;
  // 真正的url，全路径
  url: string;
}

export async function postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<DbReturn> {
  if (getPlatform() === "uTools") {
    return utools.db.promises.postAttachment(docId, attachment, type);
  } else {
    return Promise.reject(new Error("系统环境异常"))
  }
}

export function getAttachment(docId: string): Uint8Array | null {
  switch (getPlatform()) {
    case "uTools":
      return utools.db.getAttachment(docId);
    default:
      throw new Error("系统环境异常");
  }
}

export async function getAttachmentType(docId: string): Promise<string | null> {
  switch (getPlatform()) {
    case "uTools":
      return utools.db.promises.getAttachmentType(docId);
    default:
      return Promise.reject(new Error("系统环境异常"))
  }
}

export async function uploadAttachment(file: Blob, fileName: string, mineType = "application/octet-stream"): Promise<FileUploadResult> {
  const id = useSnowflake().nextId();
  const ext = extname(fileName);
  const docId = LocalNameEnum.ARTICLE_ATTACHMENT + id + (ext ? ('.' + ext) : "");
  switch (getPlatform()) {
    case "uTools":
      const buffer = await file.arrayBuffer();
      const res = await postAttachment(docId, new Uint8Array(buffer), mineType);
      if (res.error) {
        return Promise.reject(res.message);
      }
      return {
        name: fileName,
        key: docId,
        url: renderAttachmentUrlByUTools(docId)
      }
    case "web":
      // 文件上传
      const formData = new FormData();
      formData.append('file', file);
      formData.append("filename", fileName);
      return requestRemoteApi<FileUploadResult>("file", "upload", formData)
    case "tauri":
      // 获取年月日
      const base = await appDataDir();
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份补零
      const day = now.getDate().toString().padStart(2, '0'); // 日期补零
      const folder = await join(TAURI_ATTACHMENT, year, month, day); // 拼接年/月/日目录
      const e = await exists(folder, {
        baseDir: BaseDirectory.AppData
      });
      if (!e) {
        // 如果不存在目录，则创建
        await mkdir(folder, {baseDir: BaseDirectory.AppData, recursive: true});
      }
      // 修改文件名
      const name = `${useSnowflake().nextId()}.${extname(fileName)}`
      const path = await join(folder, name);
      // 写入文件
      await writeFile(path, new Uint8Array(await file.arrayBuffer()), {
        baseDir: BaseDirectory.AppData, createNew: true, create: true
      });
      const absPath = await join(base, path);
      return {
        name: fileName,
        key: absPath,
        url: convertFileSrc(absPath)
      }
  }
}

export function renderAttachmentKey(url: string): string {
  switch (getPlatform()) {
    case "uTools":
      return renderAttachmentUrlByUTools(url)
    case "web":
      return './api/file/static/' + url;
    case "tauri":
      return convertFileSrc(url);
  }
}

interface PouchValue<T> {
  _id: string;
  _rev?: string;
  value: T;
}

export interface AttachmentInfo {
  // 原始文件名
  filename: string;
  /**
   * KEY
   * @example 2025/06/18/123456.png
   */
  key: string;
  // 访问链接
  url: string;
  // 上传时间戳
  uploadTime?: number;
  // 文件类型mine-type
  type?: string;
  // 文件大小
  size?: number;
}


/**
 * 获取全部的附件链接
 * @return 全部的附件链接
 */
export async function listAttachment(): Promise<Array<AttachmentInfo>> {
  switch (getPlatform()) {
    case "uTools":
      // 获取
      const docs = await utools.db.promises.allDocs(LocalNameEnum.ARTICLE_ATTACHMENT);
      return docs.map(it => ({
        filename: basename(it._id),
        key: it._id,
        url: renderAttachmentUrlByUTools(it._id)
      }));
    case "tauri":
      const paths = new Array<AttachmentInfo>();
      const base = await appDataDir();
      const loop = async (folder: string) => {
        const files = await readDir(folder, {
          baseDir: BaseDirectory.AppData
        });
        for (let file of files) {
          if (file.isFile) {
            const path = await join(base, folder, file.name);
            paths.push({
              filename: file.name,
              key: path,
              url: convertFileSrc(path)
            });
          }
          if (file.isDirectory) await loop(await join(folder, file.name));
        }
      }
      await loop(TAURI_ATTACHMENT);
      return paths;
    case "web":
      const data = await requestRemoteApi<Array<PouchValue<AttachmentInfo>>>('file', 'attachments');
      return data.map(e => e.value);
    default:
      return Promise.reject(new Error("系统环境异常"))
  }
}

export async function deleteAttachment(info: AttachmentInfo): Promise<void> {
  switch (getPlatform()) {
    case "uTools":
      const r = await utools.db.promises.remove(info.key);
      if (r.error) {
        return Promise.reject(r.message);
      }
      break;
    case "web":
      await requestRemoteApi<void>("file", "delete", info)
      break;
    case "tauri":
      await remove(info.key, {baseDir: BaseDirectory.AppData});
  }

}