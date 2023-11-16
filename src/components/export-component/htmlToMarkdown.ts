import {useFileSystemAccess} from "@vueuse/core";
import {convert} from "@/global/BeanFactory";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";


export const htmlToMarkdown = async (folder: number, type: ArticleTypeEnum): Promise<void> => {

    const docx = useFileSystemAccess({
        dataType: 'ArrayBuffer',
        types: [{
            description: 'docx文档',
            accept: {
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document    ': ['.docx']
            }
        }]
    });

    await docx.open();
    const contentWrap = docx.data.value;
    if (!contentWrap) {
        return Promise.reject("文章内容不存在")
    }
    const title = docx.fileName.value;

    if (type === ArticleTypeEnum.MARKDOWN) {
        return convert.docxToMarkdown(folder, contentWrap, title);
    }else if (type === ArticleTypeEnum.RICH_TEXT) {
        return convert.docxToRichText(folder, contentWrap, title);
    }


}
