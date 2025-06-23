import { encryptPassword } from "~/components/encrypt";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);
  return Result.success(await encryptPassword(password));
});
