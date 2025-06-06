<template>
  <div class="home-note-reference">
    <t-tag theme="primary" shape="round" closable v-for="note in notes" :key="note.id">{{ note.name }}</t-tag>
    <t-tooltip content="新增文章引用" placement="top">
      <t-button theme="primary" variant="outline" shape="circle" size="small">
        <plus-icon size="16px"/>
      </t-button>
    </t-tooltip>
  </div>
</template>
<script lang="ts" setup>
import {PlusIcon} from "tdesign-icons-vue-next";
import {useArticleStore} from "@/store";
import {ArticleIndex} from "@/entity/article";

const noteIds = defineModel<Array<number>>({
  default: () => ([])
});
const notes = computed<Array<ArticleIndex>>(() => {
  const {articleMap} = useArticleStore();
  return noteIds.value.map(id => articleMap.get(id)!);
})
</script>
<style scoped lang="less">
.home-note-reference {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  height: 24px;
  margin-right: 8px;

  &::-webkit-scrollbar {
    display: none;
  }

}
</style>
