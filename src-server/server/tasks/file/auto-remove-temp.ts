import { TEMP_DIR } from "~/global/constants";
import { join } from "path";
import { readdir } from "node:fs/promises";

export default defineTask({
  meta: {
    name: "file:auto-remove",
    description: "自动删除过期文件",
  },
  async run({ payload, context }) {
    const files = await readdir(TEMP_DIR);
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;

    for (const file of files) {
      const filePath = join(TEMP_DIR, file);
      const f = Bun.file(filePath);
      const stats = await f.stat();

      if (stats.isFile() && stats.mtime.getTime() < tenMinutesAgo) {
        try {
          await f.unlink();
          console.log(`Deleted expired file: ${filePath}`);
        } catch (error) {
          console.error(`Error cleaning up file「${filePath}」:`, error);
        }
      }
    }
    return { result: "Successfully cleaned up expired files" };
  },
});
