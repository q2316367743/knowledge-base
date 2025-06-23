import { TEMP_DIR } from "~/global/constants";

export default defineTask({
  meta: {
    name: "file:auto-remove",
    description: "自动删除过期文件",
  },
  run({ payload, context }) {
    

    return { result: "Success" };
  },
});
