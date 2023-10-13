import {useFileSystemAccess} from "@vueuse/core";
import JSZip from "jszip";
import {parseFileName, sleep} from "@/utils/BrowserUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export async function zipToArticle() {
    const zip = useFileSystemAccess({
        dataType: 'ArrayBuffer',
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

    const instance = await JSZip.loadAsync(contentWrap);
    let lastId = 0;
    for (let title in instance.files) {
        if (!title.endsWith(".md") && !title.endsWith(".markdown")) {
            // 既不是markdown结尾，也不是md结尾
            continue;
        }
        const text = await instance.files[title].async('text');
        await sleep(100);

        lastId = await useArticleStore().add(getDefaultArticleIndex({
            source: '导入文章',
            name: parseFileName(title),
        }), getDefaultArticleBase(), text);

    }
    // 切换文章
    useHomeEditorStore().setId(lastId);

}
