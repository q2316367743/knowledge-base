import Constant, {BASE64_PREFIX} from "@/global/Constant";
import {useSnowflake} from "@/hooks/Snowflake";
import {base64toBlob} from "@/utils/BrowserUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {NativeUtil} from "@/utils/utools/NativeUtil";
import {FileUploadResult} from '@/utils/utools/AttachmentUtil';

// PicGo: https://picgo.github.io/PicGo-Doc/zh/guide/advance.html
export async function useAttachmentUploadByPicGo(data: Blob | File | string, name: string, port: number): Promise<FileUploadResult> {
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
  // 再调用接口
  const rsp = await fetch(`http://127.0.0.1:${port}/upload`, {
    body: JSON.stringify({list: [path]})
  });
  const body = await rsp.json();
  if (!body.success) {
    return Promise.reject(new Error("上传失败"));
  }

  return {url: body.result[0], key: body.result[0], name};
}