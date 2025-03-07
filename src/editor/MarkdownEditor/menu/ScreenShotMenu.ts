import Cherry from "cherry-markdown";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ShallowRef} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";

/**
 * 截屏菜单
 */
export const useScreenShotMenu = (editor: ShallowRef<Cherry | undefined>) => {
  return Cherry.createMenuHook('截屏', {
    name: '截图',
    onClick: function () {
      if (editor.value) {
        utools.hideMainWindow()
        utools.screenCapture(base64 => {
          utools.showMainWindow()
          useGlobalStore().startLoading("开始文件上传");
          useAttachmentUpload.upload(base64, true, "image/png")
            .then(url => editor.value && editor.value.insert('\n![截屏#100%](' + url + ')'))
            .catch(e => MessageUtil.error("截图失败", e))
            .finally(() => useGlobalStore().closeLoading())
        })
      }
      return ''
    }
  });
}
