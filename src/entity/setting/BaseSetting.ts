import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import { ArticleBaseSetting} from "@/entity/article";

export default interface BaseSetting extends ArticleBaseSetting{

    /**
     * 图片策略
     */
    imageStrategy: ImageStrategyEnum;

    /**
     * 当屏幕太小时，是否自动收起
     */
    authCollapsed: boolean;

    /**
     * 背景图片
     */
    backgroundImage: string;

}
