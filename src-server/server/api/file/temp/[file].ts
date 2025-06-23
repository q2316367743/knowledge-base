import { access, constants } from "node:fs/promises";
import { join, resolve } from "node:path";
import { TEMP_DIR } from "~/global/constants";

export default defineEventHandler(async (event) => {
  const fileName = getRouterParam(event, "file");

  // 防止目录注入攻击
  const safePath = resolve(join(TEMP_DIR, fileName));

  // 验证路径是否在TEMP_DIR内
  if (!safePath.startsWith(resolve(TEMP_DIR))) {
    return createError({
      statusCode: 403,
      message: "禁止访问该文件",
    });
  }

  try {
    // 检查文件是否存在
    await access(safePath, constants.R_OK);
  } catch (err) {
    return createError({
      statusCode: 404,
      message: "文件不存在",
    });
  }

  const file = Bun.file(safePath);

  // 检查是否为文件
  try {
    const stats = await file.stat();
    if (!stats.isFile()) {
      return createError({
        statusCode: 403,
        message: "不允许访问目录",
      });
    }
  } catch (err) {
    return createError({
      statusCode: 500,
      message: "获取文件信息失败",
    });
  }

  // 发送文件
  return file.stream();
});
