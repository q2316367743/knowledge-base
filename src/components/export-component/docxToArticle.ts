import {useFileSystemAccess} from "@vueuse/core";
import {convert} from "@/global/BeanFactory";


export const docxToArticle = async (folder: number): Promise<void> => {

    const html = useFileSystemAccess({
        dataType: 'Text',
        types: [{
            description: '网页文件',
            accept: {
                'text/plain': ['.html', '.htm']
            }
        }]
    });

    await html.open();
    const contentWrap = html.data.value;
    if (!contentWrap) {
        return Promise.reject("文章内容不存在")
    }
    const title = html.fileName.value;


    return convert.htmlToMarkdown(folder, contentWrap, title);
}
