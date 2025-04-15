import {base64toBlob} from "@/utils/BrowserUtil";
import Constant, {BASE64_PREFIX} from "@/global/Constant";
import {useSnowflake} from "@/hooks/Snowflake";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export async function useAttachmentUploadByImagePlus(data: Blob | File | string): Promise<string> {
  if (typeof data === 'string') {
    data = base64toBlob(data.replace(BASE64_PREFIX, ""));
  }
  // 先保存到临时目录
  const path = await window.preload.customer.writeToFile(
    Constant.id,
    useSnowflake().nextId() + '.png',
    data,
    InjectionUtil.getPath('temp')
  );
  return window.preload.util.uploadToImagePlus(path, Constant.name);
}