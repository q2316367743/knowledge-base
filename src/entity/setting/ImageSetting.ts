import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {pathJoin} from "@/utils/file/FileUtil";
import Constant from "@/global/Constant";

export interface ImageSetting {


    /**
     * 图片策略
     */
    imageStrategy: ImageStrategyEnum;

    /**
     * 本地图片目录
     */
    localImagePath: string;

}

export function getDefaultImageSetting(): ImageSetting{
    return {
        imageStrategy: ImageStrategyEnum.INNER,
        localImagePath: pathJoin(utools.getPath('cache'), Constant.id, 'image'),
    }
}
