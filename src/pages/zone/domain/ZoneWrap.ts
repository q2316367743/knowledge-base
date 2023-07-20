import {ZoneIndex, ZoneContent, ZoneComment} from "@/entity/zone";
import ZoneMediaWrap from "./ZoneMediaWrap";

export default interface ZoneWrap extends ZoneIndex {

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
