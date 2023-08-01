import type {BytemdPlugin} from 'bytemd'
import {visit} from 'unist-util-visit'
import {loadImageBySync} from "../common";

/**
 * 自定义解析图片链接插件
 * @author ZiuChen
 * @since 2023年8月1日 14:31:06
 */
export function customImagePlugin(): BytemdPlugin {
    const markdownImages = new Array<any>();
    return {
        remark: (processor) => {
            // @ts-ignore
            return processor.use(() => (tree) => {
                // 递归遍历所有节点 筛选出图片节点
                // 先清空 再重新添加
                markdownImages.length = 0;
                visit(tree, (node) => {
                    if (node.type === 'image') {
                        markdownImages.push(node)
                    }
                })
            })
        },
        rehype(processor) {
            // @ts-ignore
            return processor.use(() => (tree) => {
                // 将 MD AST 中的图片与 HTML AST 中的图片节点一一对应
                // 通过 attachmentId 获取图片数据 并替换 img 节点的 src
                let count = 0
                visit(tree, (node) => {
                    if (node.type === 'element' && node.tagName === 'img') {
                        const image = markdownImages[count]
                        // 处理自定义图片
                        if (image && image.url.startsWith('attachment:')) {
                            const attachmentId = image.url.split(':')[1];
                            node.properties.src =loadImageBySync(attachmentId);
                        }
                        // 处理Base64图片
                        if (image && image.url.startsWith('data:image')) {
                            node.properties.src = image.url
                        }
                        count++
                    }
                })
            })
        }
    }
}
