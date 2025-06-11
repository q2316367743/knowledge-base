import {blobToBase64} from "@/utils/BrowserUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {FileUploadResult, InjectionUtil} from "@/utils/utools/InjectionUtil";

export async function useAttachmentUploadByImage(data: Blob | File | string): Promise<FileUploadResult> {
  NotificationUtil.warningClose(
    "建议使用xiaou同学的新作：「图床 Plus」，更加强大好用", "附件上传",
    LocalNameEnum.TIP_IMAGE_TO_IMAGE_PLUGIN)

  if (typeof data !== 'string') {
    data = await blobToBase64(data);
  }
  // 使用图床插件
  InjectionUtil.redirect(['图床', '上传到图床'], {
    type: 'img',
    data: data
  });
  return {
    key: '',
    name: '',
    url: ''
  }
}