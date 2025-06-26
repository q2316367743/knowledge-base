import { join } from "path";
import { db, FILE_DIR } from "~/global/constants";
import { AttachmentInfo } from "~/views/AttachmentInfo";
import { PouchValue } from "~/views/PouchValue";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  // 文件路径，相对于FILE_DIR，必填
  const { key } = await readBody(event);
  if (!key) {
    return Result.error("文件路径不存在");
  }
  // 获取附件
  try {
    const doc = await db.get<PouchValue<AttachmentInfo>>(
      `/web/attachment/${key}`
    );
    await db.remove(doc);
  } catch (e) {
    console.error(e);
  }
  // 删除文件
  const abs = join(FILE_DIR, key as string);
  const f = Bun.file(abs);
  if (await f.exists()) {
    try {
      await Bun.file(abs).unlink();
    } catch (e) {
      console.log(e);
    }
  }
  return Result.success("删除文件成功");
});
