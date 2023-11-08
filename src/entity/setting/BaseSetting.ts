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
    autoCollapsedByEditor: boolean;

    /**
     * 当屏幕太小时，是否自动收起
     */
    autoCollapsedByTodo: boolean;

    /**
     * 新建文章的文件名模板
     */
    newArticleTemplateByName: string;

    /**
     * 代码拓展名
     */
    codeExtraName: string;


}
