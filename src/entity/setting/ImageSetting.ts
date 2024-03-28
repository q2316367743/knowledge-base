export interface ImageForQiNiu {

    accessKey: string;

    secretKey: string;

    /**
     * 存储桶
     */
    bucket: string;

    /**
     * 区域
     */
    region: string;

    /**
     * 是否使用CDN
     */
    useCdn: boolean;

    /**
     * 路径
     */
    path: string;

    /**
     * 域名
     */
    domain: string;
}

export interface ImageSetting {


    /**
     * 七牛配置
     */
    qiNui: ImageForQiNiu;


}

export function getDefaultImageSetting(): ImageSetting{
    return {
        qiNui: {
            accessKey: '',
            secretKey: '',
            bucket: '',
            region: '',
            useCdn: false,
            path: '',
            domain: ''
        }
    }
}
