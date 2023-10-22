import {ZoneAttachment} from "./ZoneAttachment";

export interface ZoneBase {

    /**
     * 地点
     */
    location: string;

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 媒体信息：图片、视频、音频【媒体ID】
     */
    image: Array<ZoneAttachment>;

    /**
     * 附件信息【附件类型和附件ID】
     */
    attachments: Array<ZoneAttachment>;

}

export function getDefaultZoneBase(): ZoneBase {
    return {
        location:'',
        tags: [],
        image: [],
        attachments: []
    }
}
