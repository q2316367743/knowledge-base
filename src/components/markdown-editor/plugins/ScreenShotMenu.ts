import Cherry from "cherry-markdown";
import {base64toBlob} from "@/utils/BrowserUtil";
import {useImageUpload} from "@/components/markdown-editor/common";
import MessageUtil from "@/utils/MessageUtil";
import {ShallowRef} from "vue";

/**
 * 截屏菜单
 */
export const useScreenShotMenu = (editor: ShallowRef) => {
    return Cherry.createMenuHook('截屏',  {
        name: '截图',
        onClick: function() {
            if (editor.value) {
                utools.hideMainWindow()
                utools.screenCapture(base64 => {
                    utools.showMainWindow()
                    const blob = base64toBlob(base64.replace("data:image/png;base64,", ""));
                    useImageUpload(blob)
                        .then(id => editor.value.insert('\n![截屏](attachment:' + id + ')'))
                        .catch(e => MessageUtil.error("截图失败", e))
                })
            }
            return ''
        }
    });
}
