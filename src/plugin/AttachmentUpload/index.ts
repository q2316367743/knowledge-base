import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {useAttachmentUploadByImage} from "@/plugin/AttachmentUpload/impl/ImageAttachmentUploadImpl";
import {useAttachmentUploadByPicGo} from "@/plugin/AttachmentUpload/impl/PicGoAttachmentUploadImpl";
import {useAttachmentUploadByImagePlus} from "@/plugin/AttachmentUpload/impl/ImagePlusAttachmentUploadImpl";
import {useAttachmentUploadByUtools} from "@/plugin/AttachmentUpload/impl/UToolsAttachmentUploadImpl";
import {FileUploadResult, renderAttachmentKey} from "@/utils/utools/AttachmentUtil";

export const useAttachmentUpload = {
  upload: async (data: Blob | File | string, name: string, mineType?: string): Promise<FileUploadResult> => {
    const {imageStrategy, baseSetting} = useBaseSettingStore();
    if (imageStrategy === ImageStrategyEnum.IMAGE) {
      return useAttachmentUploadByImage(data);
    } else if (imageStrategy === ImageStrategyEnum.PIC_GO) {
      if (baseSetting.imagePicGoPort) {
        return useAttachmentUploadByPicGo(data, name, baseSetting.imagePicGoPort);
      }
      return Promise.reject(new Error("PicGo端口未设置，无法上传至PicGo"));
    } else if (imageStrategy === ImageStrategyEnum.IMAGE_PLUS) {
      return useAttachmentUploadByImagePlus(data, name)
    } else {
      return useAttachmentUploadByUtools(data, name, mineType);
    }
  },
  render: (url: string) => {
    if (/^attachment:/.test(url)) {
      return renderAttachmentKey(url.replace(/^attachment:/, ""))
    }
    return url;
  }
}