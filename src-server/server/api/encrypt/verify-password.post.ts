import { verifyPassword } from "~/components/encrypt";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { password, hash } = await readBody(event);
  return Result.success(await verifyPassword(password, hash));
});
