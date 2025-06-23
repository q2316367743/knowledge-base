import { join, extname, relative } from "path";
import { existsSync, mkdirSync } from "node:fs";
import { FILE_DIR, db } from "~/global/constants";
import type { AttachmentInfo } from "~/views/AttachmentInfo";
import type { PouchValue } from "~/views/PouchValue";

/**
 * 获取文件相对路径
 * @returns 年/月/日
 */
function getRelativeFolder() {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份补零
  const day = now.getDate().toString().padStart(2, "0"); // 日期补零
  return join(year, month, day);
}

/**
 * 获取文件名称
 * @param originalname 原始文件名
 * @returns 文件名
 */
function getFilename(originalname: string) {
  const timestamp = Date.now().toString();
  const ext = extname(originalname);
  return `${timestamp}${ext}`;
}

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  const filename = formData.get("filename") as string;
  const file = formData.get("file") as File;

  const relativeFolder = getRelativeFolder();
  const folder = join(FILE_DIR, relativeFolder);
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true }); // 递归创建目录
  }
  const name = filename || file.name;
  const absolutePath = join(folder, getFilename(name));
  await Bun.file(absolutePath).write(await file.arrayBuffer());

  const relativePath =
    process.platform === "win32"
      ? relative(FILE_DIR, absolutePath).replace(/\\/g, "/")
      : relative(FILE_DIR, absolutePath);
  const url = `/api/file/static/${relativePath}`;
  // 保存数据
  db.post<PouchValue<AttachmentInfo>>({
    _id: `/web/attachment/${relativePath}`,
    value: {
      filename: name,
      key: relativePath,
      uploadTime: Date.now(),
      type: file.type,
      size: file.size,
      url,
    },
  }).catch(console.error);
  return {
    name: name,
    key: relativePath,
    url,
  };
});
