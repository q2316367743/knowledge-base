import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FILE_DIR, db } from "~/global/constants";
import type { AttachmentInfo } from "~/views/AttachmentInfo";
import type { PouchValue } from "~/views/PouchValue";

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event);
  const key = pathname.replaceAll("/api/file/static/", "");
  try {
    const doc = await db.get<PouchValue<AttachmentInfo>>(
      `/web/attachment/${key}`
    );
    // 返回完整的数据
    return new File([await readFile(join(FILE_DIR, key))], doc.value.filename, {
      type: doc.value.type,
    });
  }catch(error) {
    return createReadStream(join(FILE_DIR, key));
  }
});
