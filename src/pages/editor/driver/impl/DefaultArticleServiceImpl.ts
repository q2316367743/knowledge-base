import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {TreeNodeData} from "@arco-design/web-vue";

export default class DefaultArticleServiceImpl implements ArticleService {

    getArticle(key: string): Promise<string> {
        return Promise.resolve("");
    }

    loadToc(key: string): Promise<Array<TreeNodeData>> {
        return Promise.resolve([]);
    }

    saveArticle(key: string, content: string): Promise<void> {
        return Promise.resolve(undefined);
    }

}
