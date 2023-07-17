import ZoneAttachmentTypeEnum from "@/enumeration/ZoneAttachmentTypeEnum";

export default interface ZoneAttachment {

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
