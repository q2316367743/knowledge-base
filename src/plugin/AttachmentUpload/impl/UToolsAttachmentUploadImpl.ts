import {base64toBlob} from "@/utils/BrowserUtil";
import {BASE64_PREFIX} from "@/global/Constant";
import {FileUploadResult, InjectionUtil} from "@/utils/utools/InjectionUtil";

export async function useAttachmentUploadByUtools(data: Blob | File | string, name: string, mineType?: string): Promise<FileUploadResult> {
  if (typeof data === 'string') {
    data = base64toBlob(data.replace(BASE64_PREFIX, ""));
  }
  const {key, url} = await InjectionUtil.db.upload(data, name, mineType);
  return {url, key, name};
}