<template>
  <div class="memo-edit">
    <div class="memo-edit-container">
      <memo-card-item v-for="(item, index) in cards" :key="index" :card="item" :idx="index"/>
    </div>
    <div class="add">
      <t-dropdown :options trigger="click" @click="onAdd">
        <t-button theme="primary" shape="circle" size="large">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
      </t-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {PlusIcon} from "tdesign-icons-vue-next";
import {TdDropdownItemProps, DropdownOption} from "tdesign-vue-next";
import {IMemoInstance, MemoDataCard, MemoDataCardType, MemoInstance} from "@/editor/MemoEditor/types";
import {openMemoCardEdit} from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEdit";
import MemoCardItem from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItem.vue";
import {openMemoCardEditBatch} from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEditBatch";
import MessageUtil from "@/utils/modal/MessageUtil";

defineProps({
  cards: {
    type: Object as PropType<Array<MemoDataCard<MemoDataCardType>>>,
    default: () => []
  }
});

const options = ref<Array<DropdownOption>>([
  {
    content: '新增 | 记忆卡',
    value: 'TEXT'
  }, {
    content: '新增 | 空白卡',
    value: 'BLANK'
  }, {
    content: '新增 | 选择卡',
    value: 'CHOICE'
  }, {
    content: '新增 | 单词卡',
    value: 'WORD',
  }, {
    content: '新增 | 图片卡',
    value: 'IMAGE',
    divider: true
  }, {
    content: '批量制卡',
    value: 'BATCH'
  }, {
    content: 'AI制卡',
    value: 'AI',
    disabled: true
  }
]);

const instance = inject<IMemoInstance>(MemoInstance);
const onAdd = (item: TdDropdownItemProps) => {
  if (item.value === 'BATCH') {
    // TODO: 批量制卡
    openMemoCardEditBatch()
      .then(cards => cards.forEach(card => instance?.onAdd(card)))
      .catch(e => MessageUtil.error("批量制卡失败", e));
  } else if (item.value === 'AI') {
    // TODO: AI制卡
  } else {
    openMemoCardEdit(item.value as MemoDataCardType).then((card) => instance?.onAdd(card));
  }
};
</script>
<style scoped lang="less">
.memo-edit {
  height: 100%;
  width: 100%;

  .memo-edit-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    position: relative;
    overflow: auto;
    height: calc(100% - 16px);
    width: calc(100% - 16px);
    padding: 8px;
  }

  .add {
    position: absolute;
    right: 16px;
    bottom: 16px;
    box-shadow: var(--td-shadow-3);
    border-radius: var(--td-radius-circle);
  }
}
</style>
