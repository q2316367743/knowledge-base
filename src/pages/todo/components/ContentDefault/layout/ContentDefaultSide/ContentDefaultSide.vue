<template>
  <div class="list">
    <content-default-header/>
    <div class="list-container" @click="setItemId(0)">
      <content-default-group v-for="group in groups" :key="group.id" :group="group"/>
      <!-- 关联的文章 -->
      <a-divider orientation="left" v-if="articleList.length > 0">
          <span style="cursor: pointer;color: rgb(var(--arcoblue-6));"
                @click.stop="hideOfArticle = !hideOfArticle">
              <icon-right v-if="hideOfArticle"/>
              <icon-down v-else/>
              关联的文章
          </span>
      </a-divider>
      <a-typography v-if="!hideOfArticle" style="padding: 0 7px;">
        <a-typography-paragraph v-for="item in articleList" :key="item.id" @click.stop>
          <a-link @click="toArticleByTodo(item.id)">{{ item.name }}</a-link>
        </a-typography-paragraph>
      </a-typography>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {getDefaultTodoCategory} from "@/entity/todo/TodoCategory";
// 存储
import {useTodoStore} from "@/store/components/TodoStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
// 工具类
import MessageUtil from "@/utils/modal/MessageUtil";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";
import ContentDefaultHeader from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultHeader.vue"
import ContentDefaultGroup
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultGroup.vue";


const groups = computed(() => useTodoWrapStore().todoGroupView);


const hideOfTodo = ref(false);
const hideOfComplete = ref(false);
const hideOfAbandon = ref(false);
const hideOfArticle = ref(false);

const articleList = computed(() => useTodoStore().articleList);


function getHide(id: number) {
  if (id === 0) {
    hideOfComplete.value = false;
    hideOfAbandon.value = false;
    hideOfArticle.value = false;
    return;
  }
  const category = useTodoCategoryStore().todoCategoryMap.get(id);
  if (category) {
    hideOfTodo.value = getDefaultTodoCategory(category).hideOfTodo;
    hideOfComplete.value = getDefaultTodoCategory(category).hideOfComplete;
    hideOfAbandon.value = getDefaultTodoCategory(category).hideOfAbandon;
    hideOfArticle.value = getDefaultTodoCategory(category).hideOfArticle;
  }
}

watch(() => useTodoStore().id, () => getHide(useTodoStore().id), {immediate: true});

watch(() => hideOfTodo.value, value => {
  if (useTodoStore().id === 0) {
    return;
  }
  useTodoCategoryStore()
    .update(useTodoStore().id, {hideOfTodo: value})
    .catch(e => MessageUtil.error("更新隐藏待办异常", e))
});
watch(() => hideOfComplete.value, value => {
  if (useTodoStore().id === 0) {
    return;
  }
  useTodoCategoryStore()
    .update(useTodoStore().id, {hideOfComplete: value})
    .catch(e => MessageUtil.error("更新隐藏已完成异常", e))
});
watch(() => hideOfAbandon.value, value => {
  if (useTodoStore().id === 0) {
    return;
  }
  useTodoCategoryStore()
    .update(useTodoStore().id, {hideOfAbandon: value})
    .catch(e => MessageUtil.error("更新隐藏已放弃异常", e))
});
watch(() => hideOfArticle.value, value => {
  if (useTodoStore().id === 0) {
    return;
  }
  useTodoCategoryStore()
    .update(useTodoStore().id, {hideOfArticle: value})
    .catch(e => MessageUtil.error("更新隐藏文章异常", e))
});

const setItemId = (e: number) => useTodoWrapStore().setItemId(e);
</script>
<style scoped lang="less">

</style>
