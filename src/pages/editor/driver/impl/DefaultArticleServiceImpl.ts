import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {TreeNode} from "@/plugin/sdk/ZTree";

export default class DefaultArticleServiceImpl implements ArticleService {

    getFile(key: string): Promise<string> {
        return Promise.resolve("");
    }

    loadToc(key: string): Promise<Array<TreeNode>> {
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

    addFolder(path: string, name: string): Promise<void> {
        return Promise.resolve();
    }

    removeDir(path: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    rename(path: string, name: string): Promise<string> {
        return Promise.resolve("");
    }

    upload(path: string,file: File | Blob | string): Promise<string> {
        return Promise.resolve("");
    }

    renderImageUrl(path: string, url: string): string {
        return url;
    }

}
