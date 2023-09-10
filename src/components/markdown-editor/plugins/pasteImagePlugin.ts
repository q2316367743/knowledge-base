import type {BytemdEditorContext, BytemdPlugin} from 'bytemd'
import {useImageUpload} from "@/components/markdown-editor/common";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {RedirectPreload} from "@/plugin/utools";
import {arrayBufferToBase64} from "@/utils/BrowserUtil";
import MessageUtil from '@/utils/MessageUtil';

/**
 * 粘贴上传插件
 * @author ZiuChen
 * @since 2023年8月1日 14:31:06
 */
export function pasteImagePlugin(): BytemdPlugin {
    const handleImages = async (
        ctx: BytemdEditorContext,
        e: Event,
        itemList: DataTransferItemList | undefined
    ) => {
        const files = Array.from(itemList ?? [])
            .map((item) => {
                if (item.type.startsWith('image/')) {
                    return item.getAsFile()
                }
            })
            .filter((f): f is File => f != null)
        if (useBaseSettingStore().imageStrategy === ImageStrategyEnum.INNER) {
            if (files.length) {
                e.preventDefault() // important
                for (const file of files) {
                    // 使用 FileReader 读取图片为 base64 并上传
                    const id = await useImageUpload(file)
                    if (id) {
                        // 未聚焦 则聚焦到最后一行
                        if (!ctx.editor.hasFocus()) {
                            ctx.editor.focus()
                            ctx.editor.setCursor({line: ctx.editor.lineCount(), ch: 0})
                            ctx.appendBlock('')
                        }
                        ctx.wrapText('![', `](attachment:${id})`)
                    }
                }
            }
        } else if (useBaseSettingStore().imageStrategy === ImageStrategyEnum.IMAGE) {
            if (files.length > 0) {
                const paths = files.map(e => {
                    // @ts-ignore
                    return e.path as string;
                }).filter(e => e && e != '');
                if (paths.length > 0) {
                    utools.redirect(['图床', '上传到图床'], {
                        type: 'files',
                        data: paths
                    } as RedirectPreload);
                } else {
                    if (files.length > 1) {
                        MessageUtil.warning("只支持上传一个非文件的剪切板文件")
                    }
                    // 将第一张转为base64
                    files[0].arrayBuffer().then(ab => utools.redirect(['图床', '上传到图床'], {
                        type: 'img',
                        data: 'data:image/png;base64,' + arrayBufferToBase64(ab)
                    } as RedirectPreload));
                }
            }
        }
    }
    return {
        editorEffect(ctx) {
            ctx.editor.on('drop', async (_, e) => {
                handleImages(ctx, e, e.dataTransfer?.items)
            })
            // @ts-ignore
            ctx.editor.on('paste', async (_, e) => {
                handleImages(ctx, e, e.clipboardData?.items)
            })
        }
    }
}
