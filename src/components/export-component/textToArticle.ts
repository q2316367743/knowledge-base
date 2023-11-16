import {useFileSystemAccess,} from "@vueuse/core";
import {convert} from "@/global/BeanFactory";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

export async function textToArticle(folder: number, type: ArticleTypeEnum): Promise<void> {
    const option: any = {
        dataType: 'Text',
        types: new Array<any>()
    }
    if (type == ArticleTypeEnum.MARKDOWN) {
        option.types.push({
            description: 'Markdown文档',
            accept: {
                'text/plain': ['.md', '.markdown']
            }
        });
    } else if (type == ArticleTypeEnum.RICH_TEXT) {
        option.types.push({
            description: '富文本',
            accept: {
                'text/plain': ['.html']
            }
        });
    } else {
        option.types.push({
            description: '文本文件',
            accept: {
                '*/*': []
            }
        });
    }
    const file = useFileSystemAccess(option)
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

    return convert.textToArticle(folder, content, type, title);

}
