import { db } from "~/global/constants";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { key } = getQuery(event);
  if (!key) {
    return Result.error("key is required");
  }
  try {
    const doc = await db.get(key as string);
    return Result.success(db.remove(doc));
  } catch (err) {
    return Result.error(err.message);
  }
});
