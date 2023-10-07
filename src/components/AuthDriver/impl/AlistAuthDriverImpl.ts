import {AuthDriver} from "@/components/AuthDriver/AuthDriver";
import {Auth} from "@/entity/auth";
import axios, {AxiosRequestConfig} from "axios";
import {FileData, FileInfo, FileItem, Result} from "../domain/AlistDomain";
import {FileListItem, PathIndex} from "@/components/AuthDriver/domain/FileListItem";
import MessageUtil from "@/utils/MessageUtil";

/**
 * 生成随机字符串
 * @param len 字符串长度
 * @return 字符串
 */
function getRandomChar(len: number): string {
    const x = "0123456789qwertyuioplkjhgfdsazxcvbnm"; // 需要什么字符这里添加
    let tmp = "";
    const timestamp = new Date().getTime();
    for (let i = 0; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

let lock = false;
let todo = false;


export class AlistAuthDriverImpl implements AuthDriver {

    private readonly auth: Auth;
    private readonly baseURL: string;
    private readonly authorization: string;
    private readonly pathMap: Map<string, string>;

    private static readonly INDEX_JSON: string = '/index.json';

    constructor(auth: Auth) {
        this.auth = auth;
        this.baseURL = auth.host;
        this.authorization = auth.password;
        this.pathMap = new Map<string, string>();
    }

    async init(): Promise<void> {
        try {
            // 获取索引文件
            const result = await this.buildHttp<FileInfo>({
                url: '/api/fs/get',
                method: 'POST',
                data: {
                    path: this.getKey(AlistAuthDriverImpl.INDEX_JSON),
                    password: ''
                },
            });
            let url = result.data.raw_url as string;
            if (this.baseURL.startsWith("https") && !url.startsWith("https")) {
                // 如果站点是https，但是链接不是
                url = url.replace('http:/', 'https:/');
            }
            const indexRsp = await axios.request<Array<PathIndex>>({
                url,
                method: 'GET',
                responseType: 'json',
                headers: {
                    Authorization: this.authorization
                }
            });
            const indexes = indexRsp.data;
            for (let index of indexes) {
                this.pathMap.set(index.key, index.value)
            }
            return Promise.resolve();
        } catch (e) {
            console.error(e);
            return Promise.resolve();
        }
    }

    /**
     * 同步索引文件
     */
    private sync() {
        if (lock) {
            todo = true;
            return Promise.resolve();
        }
        lock = true;
        this._sync()
            .then(() => {
                lock = false;
                if (todo) {
                    this._sync();
                }
            })
            .catch(e => {
                lock = false;
                todo = false;
                MessageUtil.error("同步远程服务器错误", e);
            })

    }

    /**
     * 同步索引文件
     */
    private async _sync() {
        const indexes = new Array<PathIndex>();
        Array.from(this.pathMap.keys()).forEach(key => {
            const value = this.pathMap.get(key);
            if (value) {
                indexes.push({
                    key,
                    value
                })
            }
        })
        await this.buildHttp({
            url: '/api/fs/put',
            method: 'PUT',
            data: JSON.stringify(indexes),
            headers: {
                "File-Path": encodeURIComponent(this.getKey(AlistAuthDriverImpl.INDEX_JSON)),
                "Content-Type": "text/plain"
            },
        });

    }

    private buildHttpRequest(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
        // 基础URL
        config.baseURL = this.baseURL;
        // 认证字符串
        config.headers = Object.assign({}, {
            Authorization: this.authorization
        }, config.headers);
        return config
    }

    private buildHttp<T, D = any>(config: AxiosRequestConfig<D>): Promise<Result<T>> {
        return new Promise<Result<T>>((resolve, reject) => {
            axios.request<Result<T>>(this.buildHttpRequest(config)).then(rsp => {
                let result = rsp.data;
                if (result.code !== 200) {
                    reject(result.message);
                    return;
                }
                resolve(result);
            });
        });
    }

    private list(path: string): Promise<FileListItem[]> {
        return new Promise<FileListItem[]>((resolve, reject) => {
            this.buildHttp<FileData>({
                url: '/api/fs/list',
                method: 'POST',
                data: {
                    path,
                    password: "",
                    page: 1,
                    per_page: 0,
                    refresh: false
                },
            }).then(result => {
                if (path === '/') {
                    path = '';
                }
                let items = new Array<FileListItem>();
                let content = result.data.content as Array<FileItem>;
                if (content) {
                    for (let temp of content) {
                        items.push({
                            name: temp.name,
                            folder: temp.is_dir,
                            path: path + '/' + temp.name,
                        });
                    }
                }
                resolve(items);
            }).catch(e => reject(e));
        })
    }

    private getKey(path: string): string {
        return this.auth.path + path;
    }

    async allDocs(key?: string): Promise<DbDoc[]> {
        const docs = new Array<DbDoc>();

        let keys = Array.from(this.pathMap.keys());

        // 基于key过滤
        if (key) {
            keys = keys.filter(item => item.startsWith(key));
        }

        // 每一个文件获取内容
        for (let item of keys) {
            try {
                let doc = await this.get(item);
                if (doc) {
                    docs.push(doc);
                }
            } catch (e) {
                console.error(e);
            }
        }


        return Promise.resolve(docs);
    }

    allDocKeys(key?: string | undefined): Promise<string[]> {
        let keys = Array.from(this.pathMap.keys());

        // 基于key过滤
        if (key) {
            keys = keys.filter(item => item.startsWith(key));
        }

        return Promise.resolve(keys);
    }

    get(id: string): Promise<DbDoc | null> {
        const path = this.pathMap.get(id);
        if (!path) {
            return Promise.resolve(null);
        }

        return new Promise<DbDoc | null>((resolve, reject) => {
            this.buildHttp<FileInfo>({
                url: '/api/fs/get',
                method: 'POST',
                data: {
                    path: this.getKey(path),
                    password: ''
                },
            }).then(result => {
                let url = result.data.raw_url as string;
                if (this.baseURL.startsWith("https") && !url.startsWith("https")) {
                    // 如果站点是https，但是链接不是
                    url = url.replace('http:/', 'https:/');
                }
                axios.request<DbDoc>({
                    url,
                    method: 'GET',
                    responseType: 'json',
                    headers: {
                        Authorization: this.authorization
                    }
                }).then(rsp => {
                    resolve(rsp.data);
                }).catch(e => reject(e));
            }).catch(e => {
                MessageUtil.error("读取文件失败", e);
                resolve(null);
            });
        })
    }

    getAttachment(docId: string): Promise<string> {

        // 路径渲染
        const path = this.pathMap.get(docId);
        if (!path) {
            return Promise.resolve("./logo.png");
        }

        // 获取内容
        return new Promise<string>((resolve, reject) => {
            this.buildHttp<FileInfo>({
                url: '/api/fs/get',
                method: 'POST',
                data: {
                    path: this.getKey(path),
                    password: ''
                },
            }).then(result => {
                let url = result.data.raw_url as string;
                if (this.baseURL.startsWith("https") && !url.startsWith("https")) {
                    // 如果站点是https，但是链接不是
                    url = url.replace('http', 'https');
                }
                resolve(url);
            }).catch(e => reject(e))
        });
    }

    async postAttachment(docId: string, attachment: Blob): Promise<DbReturn> {

        // 处理文件路径
        const fileName = `/${new Date().getTime()}.png`;

        // 文件上传
        const formData = new FormData();
        formData.append('file', attachment);

        // 上传文件
        await axios.request<Result<any>>({
            ...this.buildHttpRequest({
                url: '/api/fs/form',
                method: 'PUT',
                headers: {
                    "File-Path": encodeURIComponent(this.getKey(fileName))
                },
            }),
            data: formData,
        });

        // 再新增索引
        this.pathMap.set(docId, fileName);
        this.sync();

        return Promise.resolve({
            id: docId,
            error: false,
            ok: true,
        });

    }

    async put(doc: DbDoc): Promise<DbReturn> {

        // 处理内容
        let rev = getRandomChar(16);
        if (doc._rev) {
            const split = doc._rev.split("-");
            const version = parseInt(split[0]);
            rev = `${version + 1}-${rev}`;
        } else {
            rev = "1-" + rev;
        }
        const item: DbDoc = {
            ...doc,
            _rev: rev
        }

        // 处理文件路径
        let fileName = `/${doc._id.replaceAll("/", ">")}.json`;

        // 先新增数据
        await this.buildHttp({
            url: '/api/fs/put',
            method: 'PUT',
            data: JSON.stringify({
                ...doc,
                _rev: rev
            }),
            headers: {
                "File-Path": encodeURIComponent(this.getKey(fileName)),
                "Content-Type": "text/plain"
            },
        });

        // 再新增索引
        this.pathMap.set(item._id, fileName);
        this.sync();

        return Promise.resolve({
            id: doc._id,
            error: false,
            ok: true,
            rev: rev
        })
    }


    async remove(doc: string | DbDoc): Promise<DbReturn> {
        const _id = typeof doc === 'string' ? doc : doc._id;
        // 先删除索引
        const id = this.pathMap.get(_id);
        if (!id) {
            return Promise.resolve({
                id: _id,
                error: true,
                ok: false,
                message: "文件不存在"
            });
        }
        this.pathMap.delete(_id);
        // 同步
        this.sync();
        // 删除内容
        const path = this.getKey(id);
        let nameIndex = path.lastIndexOf("/");
        let dir = path.substring(0, nameIndex);
        return new Promise<DbReturn>((resolve, reject) => {
            this.buildHttp({
                url: '/api/fs/remove',
                method: 'POST',
                data: {
                    dir,
                    names: [path]
                }
            })
                .then(() => resolve({
                    id: _id,
                    error: false,
                    ok: true,
                }))
                .catch(e => reject(e));
        });

    }


}
