<template>
  <div class="memo-card-item" v-if="card">
    <memo-card-item-for-text v-if="card.type === 'TEXT'" :card="card as MemoDataCard<'TEXT'>"/>
    <memo-card-item-for-choice v-else-if="card.type === 'CHOICE'" :card="card as MemoDataCard<'CHOICE'>"/>
    <memo-card-item-for-word v-else-if="card.type === 'WORD'" :card="card as MemoDataCard<'WORD'>"/>
    <memo-card-item-for-blank v-else-if="card.type === 'BLANK'" :card="card as MemoDataCard<'BLANK'>"/>
    <div class="edit">
      <t-space size="small">
        <t-button theme="primary" shape="square" size="small" @click="onEdit(idx, card)">
          <template #icon>
            <edit-icon/>
          </template>
        </t-button>
        <t-button theme="danger" shape="square" size="small" @click="onDelete(idx, card)">
          <template #icon>
            <delete-icon />
          </template>
        </t-button>
      </t-space>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {DeleteIcon, EditIcon} from "tdesign-icons-vue-next";
import {
  IMemoInstance,
  MemoDataCard,
  MemoDataCardType,
  MemoInstance,
  renderMemoDataCardType
} from "@/editor/MemoEditor/types";
import {openMemoCardEdit} from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEdit";
import MemoCardItemForText from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItemForText.vue";
import MemoCardItemForChoice from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItemForChoice.vue";
import MemoCardItemForWord from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItemForWord.vue";
import MemoCardItemForBlank from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItemForBlank.vue";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<MemoDataCardType>>,
  },
  idx: {
    type: Number,
    required: true,
    default: 0,
  }
});

const instance = inject<IMemoInstance>(MemoInstance);

const onEdit = (idx: number, card: MemoDataCard<MemoDataCardType>) => {
  openMemoCardEdit(card.type, card).then(n => {
    // 更新卡
    instance?.onUpdate(idx, n);
  })
}
const onDelete = (idx: number, card: MemoDataCard<MemoDataCardType>) => {
  MessageBoxUtil.confirm(`是否删除这张${renderMemoDataCardType(card.type)}？`, "删除卡片").then(() => {
    instance?.onDelete(idx);
  })
}
</script>
<style scoped lang="less">
.memo-card-item {
  border-radius: var(--td-radius-medium);
  box-shadow: var(--td-shadow-3);
  background-color: var(--td-bg-color-component);
  transition: background-color 0.3s ease-in-out;
  padding: 16px;
  height: 200px;
  width: 200px;
  position: relative;

  &:hover {
    background-color: var(--td-bg-color-component-hover);

    .edit {
      opacity: 1;
    }
  }

  .edit {
    position: absolute;
    top: 16px;
    right: 16px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
}
</style>
