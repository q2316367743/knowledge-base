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
import {TdDropdownItemProps} from "tdesign-vue-next";
import {IMemoInstance, MemoDataCard, MemoDataCardType, MemoInstance} from "@/editor/MemoEditor/types";
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

const instance = inject<IMemoInstance>(MemoInstance);
const onAdd = (item: TdDropdownItemProps) => {
  openMemoCardEdit(item.value as MemoDataCardType).then((card) => {
    // 添加卡片
    instance?.onAdd(card);
  });
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
    gap: 8px;
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
