import {createEditor, IDomEditor, IEditorConfig} from "@wangeditor/editor";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useImageUpload} from "@/plugin/image";
import {Ref} from "vue";

type AlertType = 'success' | 'info' | 'warning' | 'error';
type InsertFnType = (url: string, alt?: string, href?: string) => void

export function buildEditorConfig(): Partial<IEditorConfig> {
    return {
        placeholder: '请输入笔记内容',
        customAlert: (info: string, type: AlertType) => {
            MessageUtil[type](info);
        },
        scroll: true,
        autoFocus: false,
        MENU_CONF: {
            uploadImage: {
                customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
                    // async customUpload(file, insertFn) {                   // JS 语法
                    // file 即选中的文件
                    // 自己实现上传，并得到图片 url alt href
                    useImageUpload(file, true)
                        .then(url => {
                            if (url) {
                                // 最后插入图片
                                insertFn(url, file.name || "默认图片");
                            }
                        })
                }
            }
        },
        hoverbarKeys: {
            // 在编辑器中，选中链接文本时，要弹出的菜单
            link: {
                menuKeys: [
                    'editLink', 'unLink', 'open-by-utools',
                ],
            },
        },
    }
}

export function buildRickText(dom: Ref<HTMLDivElement | undefined>): IDomEditor {
    return createEditor({
        selector: dom.value,
        config: buildEditorConfig(),
        mode: 'default', // or 'simple'
    });
}
