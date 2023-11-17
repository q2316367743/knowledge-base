import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {TreeNodeData} from "@arco-design/web-vue";
import {EditorDriver} from "@/entity/editor/EditorDriver";

export class FileArticleServiceImpl implements ArticleService {


    constructor(driver: EditorDriver) {

    }

    getArticle(key: string): Promise<string> {
        return Promise.resolve("");
    }

    initToc(): Promise<Array<TreeNodeData>> {
        return Promise.resolve([]);
    }

    loadToc(key: string): Promise<Array<TreeNodeData>> {
        return Promise.resolve([]);
    }

    saveArticle(key: string, content: string): Promise<void> {
        return Promise.resolve(undefined);
    }

}
