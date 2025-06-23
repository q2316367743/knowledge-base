import { db } from "~/global/constants";
import { Result } from "~/views/Result";
import { PouchValue } from "~/views/PouchValue";
import type { AttachmentInfo } from "~/views/AttachmentInfo";

export default defineEventHandler(async () => {
  try {
    const { rows } = await db.allDocs<PouchValue<AttachmentInfo>>({
      startkey: "/web/attachment",
      attachments: false,
      include_docs: true,
    });
    return Result.success(rows.map((item) => item.doc).filter((e) => !!e));
  } catch (e) {
    return Result.error(
      "查询附件列表失败：" + (e instanceof Error ? e.message : `${e}`)
    );
  }
});
