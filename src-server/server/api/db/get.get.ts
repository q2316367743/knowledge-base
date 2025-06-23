import { db } from "~/global/constants";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { key } = getQuery(event);
  if (!key) {
    return Result.error("key is required");
  }
  try {
    const doc = await db.get(key as string);
    return Result.success(doc);
  } catch (err) {
    if (err.name === "not_found") {
      return Result.success(null);
    } else {
      console.log(err);
      return Result.error(err.message);
    }
  }
});
