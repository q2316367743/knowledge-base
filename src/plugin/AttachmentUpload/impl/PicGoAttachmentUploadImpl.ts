import Constant, {BASE64_PREFIX} from "@/global/Constant";
import {useSnowflake} from "@/hooks/Snowflake";
import {base64toBlob} from "@/utils/BrowserUtil";
import {FileUploadResult, InjectionUtil} from "@/utils/utools/InjectionUtil";

// PicGo: https://picgo.github.io/PicGo-Doc/zh/guide/advance.html
export async function useAttachmentUploadByPicGo(data: Blob | File | string, name: string, port: number): Promise<FileUploadResult> {
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