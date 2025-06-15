<template>
  <div class="memo-editor">
    <memo-preview :cards="content.cards" v-if="readOnly"/>
    <memo-edit :cards="content.cards" v-else/>
  </div>
</template>
<script lang="ts" setup>
import {
  IMemoInstance,
  MemoData,
  MemoDataSetting,
  MemoInstance
} from "@/editor/MemoEditor/types";
import {useMountEventBus} from "@/hooks/MountEventBus";
import {useArticleImportEvent} from "@/store";
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
  onUpdate: (id, card) => {
    const index = content.value.cards.findIndex(e => e.id === id);
    if (index > -1) {
      content.value.cards[index] = card;
    }
  },
  onDelete: (id) => {
    const index = content.value.cards.findIndex(e => e.id === id);
    if (index > -1) {
      content.value.cards.splice(index, 1);
    }
  },
  onStar: (id) => {
    const index = content.value.cards.findIndex(e => e.id === id);
    if (index > -1) {
      content.value.cards[index].star = !content.value.cards[index].star;
    }
  },
  getIndex: () => {
    return content.value.index;
  },
  setIndex: (index) => {
    content.value.index = index;
  },
  study: (id, status) => {
    const index = content.value.cards.findIndex(e => e.id === id);
    if (index > -1) {
      content.value.cards[index].status = status;
      content.value.cards[index].lastLearnedAt = Date.now();
    }
  },
  updateSetting: (setting: MemoDataSetting) => {
    content.value.setting = setting;
  }
});

useMountEventBus(useArticleImportEvent, id => {
  if (id === props.articleId) {
    // 导出
  }
})
</script>
<style scoped lang="less">
.memo-editor {
  width: 100%;
  height: 100%;
  transform: translate(0, 0);
}
</style>
