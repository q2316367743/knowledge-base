import Cherry from "cherry-markdown";
import {useImageUpload} from "@/plugin/image";
import MessageUtil from "@/utils/modal/MessageUtil";
import { ShallowRef} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";

/**
 * 截屏菜单
 */
export const useScreenShotMenu = (editor: ShallowRef<Cherry | undefined>) => {
    return Cherry.createMenuHook('截屏',  {
        name: '截图',
        onClick: function() {
            if (editor.value) {
                utools.hideMainWindow()
                utools.screenCapture(base64 => {
                    utools.showMainWindow()
                    useGlobalStore().startLoading("开始文件上传");
                    useImageUpload(base64)
                        .then(url => editor.value && editor.value.insert('\n![截屏](' + url + ')'))
                        .catch(e => MessageUtil.error("截图失败", e))
                        .finally(() => useGlobalStore().closeLoading())
                })
            }
            return ''
        }
    });
}
