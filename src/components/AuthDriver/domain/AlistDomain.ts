/**
 * 通用响应内容
 */
export interface Result<T> {
    code: number;
    message: string;
    data: T;
}

/**
 * 文件数据
 */
export interface FileData {
    content: FileItem[];
    total: number;
    readme: string;
    write: boolean;
    provider: string;
}

/**
 * 文件项
 */
export interface FileItem {
    // 文件名
    name: string;
    // 文件大小
    size: number;
    // 是否是目录
    is_dir: boolean;
    // 修改时间
    modified: string;
    // 签名
    sign: string;
    // 封面
    thumb: string;
    // 类型
    type: number;
}


export interface Data {
    content: Content[];
    total: number;
}

export interface Content {
    parent: string;
    name: string;
    is_dir: boolean;
    size: number;
    type: number;
}

export interface Setting {
    allow_indexed: string;
    allow_mounted: string;
    announcement: string;
    audio_autoplay: string;
    audio_cover: string;
    auto_update_index: string;
    default_page_size: string;
    external_previews: string;
    favicon: string;
    filename_char_mapping: string;
    forward_direct_link_params: string;
    hide_files: string;
    home_container: string;
    home_icon: string;
    iframe_previews: string;
    logo: string;
    main_color: string;
    ocr_api: string;
    package_download: string;
    pagination_type: string;
    robots_txt: string;
    search_index: string;
    settings_layout: string;
    site_title: string;
    sso_login_enabled: string;
    sso_login_platform: string;
    version: string;
    video_autoplay: string;
}


export interface FileInfo {
    name: string;
    size: number;
    is_dir: boolean;
    modified: string;
    sign: string;
    thumb: string;
    type: number;
    raw_url: string;
    readme: string;
    provider: string;
    related?: any;
}
