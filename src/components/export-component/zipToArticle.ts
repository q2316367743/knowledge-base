import {useFileSystemAccess} from "@vueuse/core";
import JSZip from "jszip";
import {sleep} from "@/utils/BrowserUtil";
import {parseFileName} from "@/utils/file/FileUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {convert} from "@/global/BeanFactory";

export async function zipToArticle(folder: number) {
    const zip = useFileSystemAccess({
        dataType: 'Blob',
        types: [{
            description: 'ZIP文件',
            accept: {
                'application/zip': ['.zip']
            }
        }]
    });


    await zip.open();
    const contentWrap = zip.data.value;
    if (!contentWrap) {
        return Promise.reject("文章内容不存在")
    }

    await convert.zipToArticle(folder, contentWrap);

}
