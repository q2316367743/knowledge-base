/**
 * 文章内容
 */
export default interface ZoneContent {

    /**
     * 地点
     */
    location: string;

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 内容，支持markdown
     */
    body: string;

}
