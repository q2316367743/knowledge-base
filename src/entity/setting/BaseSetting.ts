import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import { ArticleBaseSetting} from "@/entity/article";
import HomeTypeEnum from "@/enumeration/HomeTypeEnum";

export default interface BaseSetting extends ArticleBaseSetting{

    /**
     * 图片策略
     */
    imageStrategy: ImageStrategyEnum;

    /**
     * 首页类型
     */
    homeType: HomeTypeEnum;

}
