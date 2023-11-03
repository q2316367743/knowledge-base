import axios, {AxiosRequestConfig, CancelToken} from "axios";

/**
 * 兰空图床
 */
export class LskyPro {

    private option: LskyOption;

    constructor(option: LskyOption) {
        this.option = option;
    }

    setOption(option: LskyOption) {
        this.option = option;
    }

    get isAvailable(): boolean {
        return this.option.url.trim() != '';
    }

    get isLogin(): boolean {
        return this.option.url.trim() != '' && this.option.token.trim() != '';
    }

    private get config(): AxiosRequestConfig {
        let headers = {};
        if (this.option.token) {
            headers = {
                'Authorization': 'Bearer ' + this.option.token
            }
        }
        return {
            baseURL: this.option.url,
            headers: headers
        };
    }

    setStrategyId(strategyId: number) {
        this.option.strategyId = strategyId;
    }

    /**
     * 登录
     * @param auth 登录信息
     */
    async login(auth?: LskyAuth): Promise<string> {
        if (auth) {
            this.option = {
                ...this.option,
                ...auth
            };
        }
        const rsp = await axios.post<Result<LoginResult>>('/api/v1/tokens', {
            email: this.option.email,
            password: this.option.password
        }, this.config);
        if (rsp.data.status) {
            // 成功
            this.option.token = rsp.data.data.token;
            return this.option.token
        } else {
            return Promise.reject(rsp.data.message)
        }
    }

    /**
     * 清空token
     */
    async logout(): Promise<void> {
        const rsp = await axios.delete<Result<void>>('/api/v1/tokens', this.config);
        if (rsp.data.status) {
            this.option.token = '';
        } else {
            return Promise.reject(rsp.data.message)
        }
    }

    /**
     * 用户资料
     */
    async profile(): Promise<ProfileResult> {
        const rsp = await axios.get<Result<ProfileResult>>('/api/v1/profile', this.config);
        if (rsp.data.status) {
            return rsp.data.data;
        } else {
            return Promise.reject(rsp.data.message);
        }
    }

    /**
     * 策略列表
     * @param keyword 关键字
     */
    async strategies(keyword?: string): Promise<Array<StrategyResult>> {
        const rsp = await axios.get<Result<{ strategies: Array<StrategyResult> }>>(
            '/api/v1/strategies', {
                ...this.config,
                params: {
                    keyword: keyword
                }
            });
        if (rsp.data.status) {
            return rsp.data.data.strategies;
        } else {
            return Promise.reject(rsp.data.message);
        }
    }

    /**
     * 上传
     * @param file 文件
     * @param callback 回调函数
     * @param error 异常回调
     * @param config 自定义配置
     */
    upload(file: File,
           callback: (result: UploadResult) => void,
           error: (message: string) => void,
           config?: AxiosRequestConfig): UploadRequest {
        const formData = new FormData();
        formData.set("file", file);
        if (this.option.strategyId) {
            formData.set("strategy_id", this.option.strategyId + '');
        }
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        axios.post<Result<UploadResult>>('/api/v1/upload', formData, {
            ...config,
            ...this.config,
            cancelToken: source.token
        })
            .then(rsp => {
                if (rsp.data.status) {
                    callback(rsp.data.data)
                } else {
                    error(rsp.data.message);
                }
            });
        return {abort: () => source.cancel()}
    }

    /**
     * 图片列表
     * @param option 查询参数
     */
    async images(option?: Partial<ImageOption>): Promise<PageResult<ImageResult>> {
        const rsp = await axios.get<Result<PageResult<ImageResult>>>(
            '/api/v1/images', {
                ...this.config,
                params: option
            });
        if (rsp.data.status) {
            return rsp.data.data;
        } else {
            return Promise.reject(rsp.data.message);
        }
    }

    /**
     * 图片列表
     * @param option 参数
     */
    async albums(option?: Partial<AlbumOption>): Promise<PageResult<AlbumResult>> {
        const rsp = await axios.get<Result<PageResult<AlbumResult>>>(
            '/api/v1/albums', {
                ...this.config,
                params: option
            });
        if (rsp.data.status) {
            return rsp.data.data;
        } else {
            return Promise.reject(rsp.data.message);
        }

    }

    /**
     * 删除相册
     * @param id 相册ID
     */
    async removeAlbums(id: number): Promise<void> {
        const rsp = await axios.delete<Result<void>>('/api/v1/albums/' + id, this.config);
        if (rsp.data.status) {
            this.option.token = '';
        } else {
            return Promise.reject(rsp.data.message)
        }
    }

}

export interface LskyAuth {
    url: string;
    email: string;
    password: string;
    token: string;
}

export interface LskyOption extends LskyAuth {
    strategyId?: number;
}

export const getDefaultLskyOption = (): LskyOption => ({
    url: '',
    email: '',
    password: '',
    token: ''
});

interface Result<T> {
    status: boolean;
    message: string;
    data: T;
}

interface LoginResult {
    token: string
}

export interface ProfileResult {
    // 用户名
    name: string;
    // 头像地址
    avatar: string;
    // 邮箱地址
    email: string;
    // 总容量
    capacity: number;
    // 已使用容量
    used_capacity: number;
    // 个人主页地址
    url: string;
    // 图片数量
    image_num: number;
    // 相册数量
    album_num: number;
    // 注册IP
    registered_ip: string;
}

export interface StrategyResult {
    id: number;
    name: string;
}

export interface UploadResult {
    // 图片唯一秘钥
    key: string;
    // 图片名称
    name: string;
    // 图片路径名
    pathname: string;
    // 图片原始名
    origin_name: string;
    // 图片大小，单位kb
    size: number;
    // 图片类型
    mimetype: string;
    // 图片拓展名
    extension: string;
    // 图片 md5 值
    md5: string;
    // 图片 sha1 值
    sha1: string;
    // 链接
    links: UploadLinkResult;
}

export interface UploadLinkResult {
    url: string;
    html: string;
    bbcode: string;
    markdown: string;
    markdown_whit_link: string;
    // 图片缩略图
    thumbnail_url: string;
}

export interface ImageOption {
    // 页码
    page: number;
    // 排序方式
    order: ImageOrder;
    // 权限
    permission: ImagePermission;
    // 相册ID
    album_id: number;
    // 筛选关键字
    keyword: string
}

// 排序方式，newest=最新，earliest=最早，utmost=最大，least=最小
export type ImageOrder = 'newest' | 'earliest' | 'utmost' | 'least';

// 权限，public=公开的，private=私有的
export type ImagePermission = 'public' | 'private';

export interface PageResult<T> {
    // 当前所在页页码
    current_page: number;
    // 最后一页页码
    last_page: number;
    // 每页展示数据数量
    per_page: number;
    // 总数量
    total: number;
    // 数据
    data: Array<T>;
}

export interface ImageResult {
    // 图片唯一秘钥
    key: string;
    // 图片名称
    name: string;
    // 图片原始名称
    origin_name: string;
    // 图片路径名
    pathname: string;
    // 图片大小，单位KB
    size: number;
    // 图片宽度
    width: number;
    // 图片高度
    height: number;
    // 图片 md5 值
    md5: string;
    // 图片 sha1 值
    sha1: string;
    // 上传时间（友好格式）
    human_date: string;
    // 上传日期（yyyy-MM-dd HH:mm:ss）
    date: string;
    // 链接
    links: UploadLinkResult;
}

// 排序方式，newest=最新，earliest=最早，most=图片最多，least=图片最少
export type AlbumType = 'newest' | 'earliest' | 'most' | 'least';

export interface AlbumOption {
    // 页码
    page: number;
    // 排序方式
    order: AlbumType;
    // 筛选关键字
    keyword: string;
}

export interface AlbumResult {
    // 相册自增ID
    id: number;
    // 相册名称
    name: string;
    // 相册简介
    intro: string;
    // 相册图片数量
    image_num: number;
}

export interface UploadRequest {
    abort: () => void;
}
