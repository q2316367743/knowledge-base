<template>
  <div class="todo-relation-note">
    <div class="todo-relation-note__header">
      <t-input class="left" v-model="keyword" clearable>
        <template #prefix-icon>
          <search-icon/>
        </template>
      </t-input>
      <t-button class="right" @click="openAddRelationArticle()">
        <template #icon>
          <plus-icon />
        </template>
        关联
      </t-button>
    </div>
    <div class="todo-relation-note__content">
      <div class="todo-relation-note-item" v-for="{item} in results" :key="item.id"
           @click="toArticleByTodo(item.id)">
        <component :is="buildArticleIcon(item.type, true)"/>
        <div class="title">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useTodoArticleStore} from "@/store/db/TodoArticleStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";
import {buildArticleIcon} from "@/pages/note/components/he-context";
import {ArticleIndex} from "@/entity/article";
import {PlusIcon, SearchIcon} from "tdesign-icons-vue-next";
import {openAddRelationArticle} from "@/pages/todo/common/AddRelationArticle";
import {useFuse} from "@vueuse/integrations/useFuse";

const keyword = ref('');

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

const {results} = useFuse<ArticleIndex>(keyword, articles, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: ['name'],
    includeScore: true,
    includeMatches: true,
    threshold: 0.3
  }
})

</script>
<style scoped lang="less">
.todo-relation-note {
  height: 100%;
  width: 100%;
  position: relative;

  .todo-relation-note__header {
    height: 32px;
    padding: 0 8px;
    display: flex;

    .left {
      min-width: 150px;
      max-width: 400px;
      width: 50%;
    }

    .right {
      margin-left: auto;
    }
  }

  .todo-relation-note__content {
    height: calc(100% - 40px);
    margin-top: 8px;
    overflow-y: auto;

    .todo-relation-note-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 10px;
      border-bottom: 1px solid var(--td-border-level-2-color);
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--td-brand-color);
      }

      .title {
        margin-left: 4px;
      }
    }
  }


}
</style>
