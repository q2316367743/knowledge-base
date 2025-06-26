import { db } from "~/global/constants";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { key } = await readBody(event);
  const dbs = await db.allDocs({
    startkey: key,
    include_docs: true,
  });
  return Result.success(dbs.rows?.map(e => e.doc!));
});
