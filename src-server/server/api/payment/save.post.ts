import fs from "fs";
import { GOOD_IDS_PATH, PAYMENT_DIR } from "~/global/constants";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { goodId } = await readBody(event);
  if (!goodId) {
    return Result.error("goodId is required");
  }
  try {
    if (!fs.existsSync(PAYMENT_DIR)) {
      fs.mkdirSync(PAYMENT_DIR, { recursive: true });
    }
    // 确保goodIds文件存在，如果不存在则创建一个包含空数组的文件
    if (!fs.existsSync(GOOD_IDS_PATH)) {
      fs.writeFileSync(GOOD_IDS_PATH, "[]", "utf8");
    }
    // 读取现有的goodIds
    const goodIdsFile = Bun.file(GOOD_IDS_PATH);
    const goodIds = (await goodIdsFile.json()) as Array<string>;

    // 检查goodId是否已存在，如果不存在则添加
    if (!goodIds.includes(goodId)) {
      goodIds.push(goodId);
      goodIdsFile.write(JSON.stringify(goodIds));
    }
    return Result.success({ message: "goodId saved successfully" });
  } catch (err) {
    console.error("Error saving goodId:", err);
    return Result.error("Failed to save goodId");
  }
});
