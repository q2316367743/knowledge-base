import {useArticleStore} from "@/store/db/ArticleStore";
import {listToList} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleSource} from "@/entity/article";
import JSZip from "jszip";
import {download} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";


export async function markdownToZip() {
    const zip = new JSZip();
    // 查询全部目录结构
    let map = listToList(useFolderStore().folders, useArticleStore().folderMap);
    // 获取markdown内容
    for (let path of map.keys()) {
        const articleId = map.get(path);
        if (articleId) {
            const content = await getFromOneWithDefaultByAsync<ArticleSource>(
                LocalNameEnum.ARTICLE_CONTENT + articleId, {content: ''});

            zip.file(path, content.record.content);
        }
    }
    const zipContent = await zip.generateAsync({type: "arraybuffer"});
    download(zipContent,
        "知识库|" + toDateString(new Date(), "yyyy-MM-dd_HH_mm_ss") + ".zip",
        "application/zip");
}
