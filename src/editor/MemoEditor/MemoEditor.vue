<template>
  <div class="memo-editor">
    <memo-preview :cards="content.cards" v-if="readOnly"/>
    <memo-edit :cards="content.cards" v-else/>
  </div>
</template>
<script lang="ts" setup>
import {IMemoInstance, MemoData, MemoInstance} from "@/editor/MemoEditor/types";
import MemoPreview from "@/editor/MemoEditor/layout/MemoPreview/MemoPreview.vue";
import MemoEdit from "@/editor/MemoEditor/layout/MemoEdit/MemoEdit.vue";

const content = defineModel<MemoData>({
  default: {}
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  articleId: Number,
});

provide<IMemoInstance>(MemoInstance, {
  onAdd: (card) => {
    content.value.cards.push(card);
  },
  onUpdate: (index, card) => {
    content.value.cards[index] = card;
  },
  onDelete: (index) => {
    content.value.cards.splice(index, 1);
  },
  onStar: (index) => {
    content.value.cards[index].star = !content.value.cards[index].star;
  },
  getIndex: () => {
    return content.value.index;
  },
  setIndex: (index) => {
    content.value.index = index;
  }
})
</script>
<style scoped lang="less">
.memo-editor {
  width: 100%;
  height: 100%;
}
</style>
