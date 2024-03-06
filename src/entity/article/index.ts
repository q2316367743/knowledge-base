import {ArticleIndex} from "@/entity/article/ArticleIndex";
import {ArticleBase} from "@/entity/article/ArticleBase";
import {ArticleContent} from "@/entity/article/ArticleContent";

export * from './ArticleIndex';
export * from './ArticleBase';

/**
 * 文章
 */
export interface Article {
    index: ArticleIndex;
    base: ArticleBase;
    content: ArticleContent;
}
