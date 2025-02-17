<template>
  <div class="content-default-article">
    <div class="content-default-article__header" @click.stop="toggleVisible()">
      <div class="content-default-article__header-left">
        <div class="content-default-article__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-article__header-title">关联的文章</div>
        <div class="content-default-article__header-count">{{ count }}</div>
      </div>
      <div class="extra">
        <a-button type="text" size="mini" @click.stop="openAddRelationArticle">
          <template #icon>
            <icon-edit/>
          </template>
        </a-button>
      </div>
    </div>
    <div v-if="visible" class="content-default-article__content">
      <div class="content-default-article-item" v-for="article in articles" :key="article.id" @click="toArticleByTodo(article.id)">
        <component :is="buildArticleIcon(article.type, true)" />
        <div class="title">{{ article.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useTodoArticleStore} from "@/store/db/TodoArticleStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {openAddRelationArticle} from "@/pages/todo/components/common/AddRelationArticle";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";
import {buildArticleIcon} from "@/pages/note/components/he-context";
import {ArticleIndex} from "@/entity/article";

const items = computed<Array<number>>(() => useTodoArticleStore().items);
const articles = computed<Array<ArticleIndex>>(() => {
  const {articleMap} = useArticleStore();
  const list = new Array<ArticleIndex>();
  for (const item of items.value) {
    const one = articleMap.get(item);
    if (one) {
      list.push(one);
    }
  }
  return list;
})
const count = computed(() => articles.value.length);

const visible = ref(true);

const toggleVisible = useToggle(visible);
</script>
<style scoped lang="less">
.content-default-article {
  margin: 7px 8px 14px;
  border-radius: 2px;
  position: relative;

  .content-default-article__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;

    .content-default-article__header-left {
      display: flex;
      height: 24px;
      align-items: center;
      font-size: 0.8rem;
      cursor: pointer;


      .content-default-article__header-handle {
        color: var(--color-text-2);

        :deep(.arco-icon) {
          transition: 0.3s;
        }
      }

      .content-default-article__header-title {
        margin: 0 8px;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .content-default-article__header-count {
        color: var(--color-text-2);
      }
    }

  }

  .content-default-article__content {
    margin-top: 7px;

    .content-default-article-item {
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
