import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import { ArticleBaseSetting} from "@/entity/article";

export default interface BaseSetting extends ArticleBaseSetting{

    /**
     * 图片策略
     */
    imageStrategy: ImageStrategyEnum;

}
