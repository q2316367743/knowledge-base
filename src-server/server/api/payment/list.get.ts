import fs from "fs";
import { GOOD_IDS_PATH, PAYMENT_DIR } from "~/global/constants";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  try {
    if (!fs.existsSync(PAYMENT_DIR)) {
      return Result.success([]);
    }
    // 确保goodIds文件存在，如果不存在则创建一个包含空数组的文件
    if (!fs.existsSync(GOOD_IDS_PATH)) {
      return Result.success([]);
    }
    const goodIdsFile = Bun.file(GOOD_IDS_PATH);
    const goodIds = (await goodIdsFile.json()) as Array<string>;
    return Result.success(goodIds);
  } catch (err) {
    console.error("Error reading goodIds:", err);
    return Result.error("Failed to read goodIds");
  }
});
