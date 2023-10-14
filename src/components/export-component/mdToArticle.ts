import {useFileSystemAccess} from "@vueuse/core";
import {parseFileName} from "@/utils/FileUtil";

export async function mdToArticle(): Promise<{
    title: string;
    content: string
}> {
    const file = useFileSystemAccess({
        dataType: 'Text',
        types: [{
            description: 'Markdown文档',
            accept: {
                'text/plain': ['.md', '.markdown']
            }
        }]
    })
    await file.open();
    let content = "";
    const contentWrap = file.data.value;
    if (contentWrap) {
        content = contentWrap.trim();
    }
    const title = file.fileName.value;
    if (!content) {
        return Promise.reject("文章内容不存在")
    }

    return {
        title: parseFileName(title),
        content: content
    }

}
