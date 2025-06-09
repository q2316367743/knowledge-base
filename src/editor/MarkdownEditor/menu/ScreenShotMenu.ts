import Cherry from "cherry-markdown";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ShallowRef} from "vue";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

/**
 * 截屏菜单
 */
export const useScreenShotMenu = (editor: ShallowRef<Cherry | undefined>) => {
  return Cherry.createMenuHook('截屏', {
    name: '截图',
    onClick: function () {
      if (editor.value) {
        InjectionUtil.window.hideMainWindow()
        InjectionUtil.screenCapture(base64 => {
          InjectionUtil.window.showMainWindow()
          const name = `截屏-${Date.now()}.png`;
          useAttachmentUpload.upload(base64, name, "image/png")
            .then(({name, key}) => editor.value && editor.value.insert(`![${name}#100%](` + key + ')'))
            .catch(e => MessageUtil.error("截图失败", e))
        })
      }
      return ''
    }
  });
}
