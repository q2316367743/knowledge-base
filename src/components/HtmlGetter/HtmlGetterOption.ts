import WebsiteRule from "@/entity/WebsiteRule";

export interface HtmlGetterOption {

    /**
     * 地址
     */
    url: string;

    /**
     * 文章主体选择器
     */
    selector: string;

    /**
     * 规则
     */
    rule: WebsiteRule;

}



