import { encryptValue } from "~/components/encrypt";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const {key, iv, data} = await readBody(event);
  return Result.success(encryptValue({key, iv}, data));
});
