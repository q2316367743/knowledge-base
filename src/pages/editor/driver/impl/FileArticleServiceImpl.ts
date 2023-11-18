import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {EditorDriver} from "@/entity/editor/EditorDriver";
import {FsDriver} from "@/components/AuthDriver/FsDriver";
import {UtoolsFsDriverImpl} from "@/components/AuthDriver/fs/UtoolsFsDriverImpl";
import {TreeNode} from "@/plugin/sdk/ZTree";

export class FileArticleServiceImpl implements ArticleService {

    private readonly fsDriver: FsDriver;
    private readonly driver: EditorDriver;

    constructor(driver: EditorDriver) {
        this.fsDriver = new UtoolsFsDriverImpl();
        this.driver = driver;
    }

    async loadToc(key: string): Promise<Array<TreeNode>> {
        if (key === '') {
            key = this.driver.path;
        }
        const items = await this.fsDriver.readDir(key);
        const nodes = new Array<TreeNode>();
        for (let item of items) {
            nodes.push({
                key: item.path,
                isLeaf: !item.dir,
                children: item.dir ? [] : undefined,
                name: item.name
            })
        }
        return Promise.resolve(nodes);
    }

    getFile(key: string): Promise<string> {
        return Promise.resolve(this.fsDriver.readTextFile(key));
    }

    saveFile(key: string, content: string): Promise<void> {
        return this.fsDriver.writeTextFile(key, content);
    }

    addFile(path: string, name: string): Promise<void> {
        return this.fsDriver.writeTextFile(window.path.join(path, name), '');
    }

    removeFile(path: string): Promise<void> {
        return this.fsDriver.removeFile(path);
    }

    addFolder(path: string, name: string): Promise<void> {
        return this.fsDriver.createDir(window.path.join(path, name))
    }

    removeDir(path: string): Promise<void> {
        return this.fsDriver.removeDir(path, true);
    }

    async rename(path: string, name: string): Promise<string> {
        const dir = window.path.dirname(path);
        const newPath = window.path.join(dir, name);
        await this.fsDriver.renameFile(path, newPath);
        return Promise.resolve(newPath);
    }

}
