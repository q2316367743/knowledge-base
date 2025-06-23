import { db } from "~/global/constants";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { key, value } = await readBody(event);
  if (!key || !value) {
    return Result.error("key and value are required");
  }
  try {
    const doc = await db.put({ _id: key, ...value });
    return Result.success(doc);
  } catch (err) {
    return Result.error(err.message);
  }
});
