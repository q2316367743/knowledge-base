// PicGo: https://picgo.github.io/PicGo-Doc/zh/guide/advance.html
// 图床工具plus: https://docs.on-u.cn/picture-bed-plus/Service.html
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {useAttachmentUploadByImage} from "@/plugin/AttachmentUpload/impl/ImageAttachmentUploadImpl";
import {useAttachmentUploadByPicGo} from "@/plugin/AttachmentUpload/impl/PicGoAttachmentUploadImpl";
import {useAttachmentUploadByImagePlus} from "@/plugin/AttachmentUpload/impl/ImagePlusAttachmentUploadImpl";
import {useAttachmentUploadByUtools} from "@/plugin/AttachmentUpload/impl/UToolsAttachmentUploadImpl";
import {renderAttachmentUrl} from "@/plugin/server";

export const useAttachmentUpload = {
  upload: async (data: Blob | File | string, native = false, mineType?: string): Promise<string> => {
    const {imageStrategy, baseSetting} = useBaseSettingStore();
    if (imageStrategy === ImageStrategyEnum.INNER) {
      const result = await useAttachmentUploadByUtools(data, mineType);
      if (native) {
        return "attachment:" + result;
      }
      return renderAttachmentUrl(result);
    } else if (imageStrategy === ImageStrategyEnum.IMAGE) {
      return useAttachmentUploadByImage(data);
    } else if (imageStrategy === ImageStrategyEnum.PIC_GO) {
      if (baseSetting.imagePicGoPort) {
        return useAttachmentUploadByPicGo(data, baseSetting.imagePicGoPort);
      } else {
        NotificationUtil.warning("PicGo端口未设置，无法上传至PicGo", "附件上传");
      }
    } else if (imageStrategy === ImageStrategyEnum.IMAGE_PLUS) {
      return useAttachmentUploadByImagePlus(data)
    }
    return Promise.reject("请在基础设置中选择图片上传策略")
  },
  render: (url: string) => {
    if (/"$attachment:"/.test(url)) {
      return renderAttachmentUrl(url.replace(/^attachment:/, ""))
    }
    return url;
  }
}