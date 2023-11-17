import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {TreeNodeData} from "@arco-design/web-vue";
import {EditorDriver} from "@/entity/editor/EditorDriver";
import {FsDriver} from "@/components/AuthDriver/FsDriver";
import {UtoolsFsDriverImpl} from "@/components/AuthDriver/fs/UtoolsFsDriverImpl";
import {h} from "vue";
import {IconFile, IconFolder} from "@arco-design/web-vue/es/icon";

export class FileArticleServiceImpl implements ArticleService {

    private readonly fsDriver: FsDriver;
    private readonly driver: EditorDriver;

    constructor(driver: EditorDriver) {
        this.fsDriver = new UtoolsFsDriverImpl();
        this.driver = driver;
    }

    async loadToc(key: string): Promise<Array<TreeNodeData>> {
        if (key === '') {
            key = this.driver.path;
        }
        const items = await this.fsDriver.readDir(key);
        const nodes = new Array<TreeNodeData>();
        for (let item of items) {
            nodes.push({
                key: item.path,
                isLeaf: !item.dir,
                children: item.dir ? [] : undefined,
                title: item.name,
                icon: () => item.dir ? h(IconFolder) : h(IconFile)
            })
        }
        return Promise.resolve(nodes);
    }

    getArticle(key: string): Promise<string> {
        return Promise.resolve(this.fsDriver.readTextFile(key));
    }

    saveArticle(key: string, content: string): Promise<void> {
        return this.fsDriver.writeTextFile(key, content);
    }

}
