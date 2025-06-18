import {base64toBlob} from "@/utils/BrowserUtil";
import Constant, {BASE64_PREFIX} from "@/global/Constant";
import {useSnowflake} from "@/hooks/Snowflake";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {NativeUtil} from "@/utils/utools/NativeUtil";
import {FileUploadResult} from '@/utils/utools/AttachmentUtil';

// 图床工具plus: https://docs.on-u.cn/picture-bed-plus/Service.html
export async function useAttachmentUploadByImagePlus(data: Blob | File | string, name: string): Promise<FileUploadResult> {
  if (typeof data === 'string') {
    data = base64toBlob(data.replace(BASE64_PREFIX, ""));
  }
  // 先保存到临时目录
  const path = await NativeUtil.customer.writeToFile(
    Constant.id,
    useSnowflake().nextId() + '.png',
    data,
    await InjectionUtil.path.temp()
  );
  const url = await NativeUtil.util.uploadToImagePlus(path, Constant.name);
  return {url, key: url, name};
}