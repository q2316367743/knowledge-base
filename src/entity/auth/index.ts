export interface Auth {

    /**
     * 认证类型
     */
    type: AuthType;

    /**
     * 主机
     */
    host: string;

    /**
     * 路径
     */
    path: string;

    /**
     * 用户名
     */
    username: string;

    /**
     * 密码
     */
    password: string;

}

export enum AuthType {

    /**
     * utools，默认
     */
    UTOOLS = 1,

    /**
     * AList
     */
    ALIST = 2,

    /**
     * WebDAV
     */
    WEBDAV = 3,

    /**
     * 本地认证
     */
    LOCATION = 4

}

export function getDefaultAuth(): Auth {
    return {
        type: AuthType.UTOOLS,
        host: '',
        path: '',
        username: '',
        password: ''
    }
}
