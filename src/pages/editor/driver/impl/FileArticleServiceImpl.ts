import {ArticleService} from "@/pages/editor/driver/ArticleService";
import {EditorDriver} from "@/entity/editor/EditorDriver";
import {FsDriver} from "@/components/AuthDriver/FsDriver";
import {UtoolsFsDriverImpl} from "@/components/AuthDriver/fs/UtoolsFsDriverImpl";
import {TreeNode} from "@/plugin/sdk/ZTree";
import {base64toBlob} from "@/utils/BrowserUtil";

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

    // 上传到文章路径下的image目录
    async upload(path: string, file: File | Blob | string): Promise<string> {
        // 获取根目录
        const dir = window.path.dirname(path);
        const image = window.path.join(dir, "image");
        if (!await this.fsDriver.exists(image)) {
            // 不存在目录，创建
            await this.fsDriver.createDir(image);
        }
        // 获取文件名
        const fileName = file instanceof File ? file.name : (new Date().getTime() + '.png');
        // 否在目标文件路径
        const target = window.path.join(image, fileName);
        // 转换文件内容类型
        const data = typeof file === 'string' ? base64toBlob(file.replace("data:image/png;base64,", "")) : file;
        // 写入二进制文件
        await this.fsDriver.writeBinaryFile(target, data);
        return Promise.resolve(`./image/${encodeURIComponent(fileName)}`);
    }

    renderImageUrl(path: string, url: string): string {
        // 获取根目录
        const dir = window.path.dirname(path);
        // 否在目标文件路径
        const target = window.path.join(dir, url);
        return `file://${utools.isWindows() ? ('/' + target.replaceAll("\\", "/")) : target}`;
    }

}
