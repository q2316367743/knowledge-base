
export enum ZoneAttachmentTypeEnum {

    IMAGE = 1

}

export interface ZoneAttachment {

    /**
     * 附件ID
     */
    id:string;

    /**
     * 附件类型
     */
    type: ZoneAttachmentTypeEnum;

    /**
     * 附件的名字
     */
    name: string;

}
