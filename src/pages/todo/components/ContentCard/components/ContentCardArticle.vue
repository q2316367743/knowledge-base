<template>
  <div class="content-card-article">
    <header class="content-card-article__header">
      <div class="title">
        关联的文章
        <a-tag class="length">{{ count }}</a-tag>
      </div>
      <div class="extra">
        <a-button type="text" @click="openAddRelationArticle">
          <template #icon>
            <icon-edit/>
          </template>
        </a-button>
      </div>
    </header>
    <div class="content-card-article__content">
      <div class="content-card-article-item" v-for="article in articles" :key="article.id" @click="toArticleByTodo(article.id)">
        <component :is="buildArticleIcon(article.type, true)" />
        <div class="title">{{ article.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ArticleIndex} from "@/entity/article";
import {useTodoArticleStore} from "@/store/db/TodoArticleStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";
import {buildArticleIcon} from "@/pages/home/components/he-context";
import {openAddRelationArticle} from "@/pages/todo/components/common/AddRelationArticle";

const articles = computed<Array<ArticleIndex>>(() => {
  const {items} = useTodoArticleStore();
  const {articleMap} = useArticleStore();
  return items.map(item => articleMap.get(item)).filter(item => !!item);
});
const count = computed(() => articles.value.length);
</script>
<style scoped lang="less">
.content-card-article {
  width: 256px;
  height: calc(100% - 14px);
  margin: 7px 8px;
  border-radius: var(--border-radius-medium);
  position: relative;
  border: 2px solid transparent;
  padding: 0 4px;

  .content-card-article__header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .title {
      padding: 8px 8px;
      font-weight: bold;

      .length {
        font-weight: normal;
        font-size: 0.8rem;
        margin-left: 4px;
      }
    }
  }

  .content-card-article__content {
    margin-top: 8px;
    // TODO: 此处要滚动

      .content-card-article-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6px 8px;
        border-bottom: 1px solid var(--color-border-1);
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: rgb(var(--arcoblue-6));
        }

        .title {
          margin-left: 4px;
        }
    }
    
  }
}
</style>
