<template>
  <div class="memo-edit">
    <memo-card-item v-for="(item, index) in cards" :key="index" :card="item"/>
    <div class="add">
      <t-dropdown :options trigger="click">
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
import {TdDropdownItemProps} from "tdesign-vue-next";
import {PlusIcon} from "tdesign-icons-vue-next";
import {MemoDataCard, MemoDataCardType} from "@/editor/MemoEditor/types";
import {openMemoCardEdit} from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEdit";
import MemoCardItem from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItem.vue";

defineProps({
  cards: {
    type: Object as PropType<Array<MemoDataCard<MemoDataCardType>>>,
    default: () => []
  }
});
const options = ref<Array<TdDropdownItemProps>>([
  {
    content: '新增记忆卡',
    value: 'TEXT'
  }, {
    content: '新增填空卡',
    value: 'BLANK'
  }, {
    content: '新增选择卡',
    value: 'CHOICE'
  }, {
    content: '新增单词卡',
    value: 'WORD'
  }
]);
const onAdd = (item: TdDropdownItemProps) => {
  openMemoCardEdit(item.value as MemoDataCardType).then((card) => {
    // 添加卡片
    cards.value.push(card);
  });
};
</script>
<style scoped lang="less">
.memo-edit {
  height: calc(100% - 16px);
  width: calc(100% - 16px);
  padding: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  position: relative;

  .add {
    position: absolute;
    right: 16px;
    bottom: 16px;
    box-shadow: var(--td-shadow-3);
    border-radius: var(--td-radius-circle);
  }
}
</style>
