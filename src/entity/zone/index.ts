import ZoneAttachment from "./ZoneAttachment";

export default interface Zone {

    id: number;

    createTime: Date | string;

    updateTime: Date | string;

    /**
     * 媒体信息：图片、视频、音频【媒体ID】
     */
    image: Array<ZoneAttachment>;

    /**
     * 附件信息【附件类型和附件ID】
     */
    attachments: Array<ZoneAttachment>;

    /**
     * 是否收藏夹中的文章。 如果不存在，则为false。 存在的话，展示在收藏夹中。
     */
    collect: boolean;

}
