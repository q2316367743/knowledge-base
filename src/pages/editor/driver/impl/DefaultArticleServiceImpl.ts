import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {TreeNodeData} from "@arco-design/web-vue";

export default class DefaultArticleServiceImpl implements ArticleService {

    getFile(key: string): Promise<string> {
        return Promise.resolve("");
    }

    loadToc(key: string): Promise<Array<TreeNodeData>> {
        return Promise.resolve([]);
    }

    saveFile(key: string, content: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    addFile(path: string, name: string): Promise<void> {
        return Promise.resolve();
    }

    removeFile(path: string): Promise<void> {
        return Promise.resolve();
    }

}
