import RuleRenderTypeEnum from "@/enumeration/RuleRenderTypeEnum";

export default interface WebsiteRule {

    id: string;

    /**
     * 规则名称
     */
    name: string;

    /**
     * url匹配规则
     */
    regex: string;

    /**
     * css选择器
     */
    select: string;

    /**
     * 渲染规则
     */
    render: RuleRenderTypeEnum;

    // ------ 拓展功能 ------

    /**
     * 图片资源标签
     */
    imageSrcAttr?: string;

    /**
     * 标题规则
     */
    title?: string;

    /**
     * 图片路径
     */
    imagePath?: string;

    // ------ 开发者选项 ------

    /**
     * url重写规则，return新的url
     */
    url: string;

    /**
     * 请求方法
     */
    method: string;

    /**
     * 编码，默认utf-8
     */
    charset: string;

    /**
     * 超时时间，单位ms，默认2000ms。超时后，页面不会被终止，并且将被refetch。
     */
    timeout: number;

    /**
     * JSON字符串
     */
    headers: string;

    /**
     * User-Agent
     */
    userAgent: string;

}
