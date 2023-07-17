import Zone from "@/entity/zone";
import ZoneContent from "@/entity/zone/ZoneContent";
import ZoneMediaWrap from "./ZoneMediaWrap";
import ZoneComment from "@/entity/zone/ZoneComment";

export default interface ZoneWrap extends Zone {

    /**
     * 文章内容
     */
    content: ZoneContent;

    /**
     * 原始内容
     */
    source: string;

    /**
     * 图片信息信息
     */
    imageWrap: Array<ZoneMediaWrap>;

    /**
     * 评论
     */
    comments: Array<ZoneComment>;

}
