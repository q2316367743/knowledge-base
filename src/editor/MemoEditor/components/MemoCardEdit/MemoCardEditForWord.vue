<template>
  <t-form-item label="单词" label-align="top">
    <t-input v-model="data.word" placeholder="请输入单词" :clearable="true"/>
  </t-form-item>

  <t-form-item label-align="top">
    <template #label>
      <div class="flex justify-between">
        <div>解释</div>
        <t-button theme="primary" variant="text" size="small" @click="onAddMeaning">
          <template #icon>
            <plus-icon/>
          </template>
          添加解释
        </t-button>
      </div>
    </template>
    <div v-if="data.meaning && data.meaning.length > 0" class="flex flex-col w-full gap-8px first:mt-8px">
      <t-row :gutter="8" v-for="(_item, index) in data.meaning" :key="index" class="w-full ">
        <t-col flex="96px">
          <t-input v-model="data.meaning[index].partOfSpeech" placeholder="请输入词性" clearable/>
        </t-col>
        <t-col flex="auto">
          <t-input v-model="data.meaning[index].translation" placeholder="请输入翻译" clearable/>
        </t-col>
        <t-col flex="32px">
          <t-button theme="danger" shape="square" @click="onDeleteMeaning(index)">
            <template #icon>
              <delete-icon/>
            </template>
          </t-button>
        </t-col>
      </t-row>
    </div>
    <div class="w-full flex justify-center" v-else>
      <t-empty type="empty" title="请添加解释"></t-empty>
    </div>
  </t-form-item>

  <t-form-item label-align="top">
    <template #label>
      <div class="flex justify-between">
        <div>例句</div>
        <t-button theme="primary" variant="text" size="small" @click="onAddExample">
          <template #icon>
            <plus-icon/>
          </template>
          添加例句
        </t-button>
      </div>
    </template>
    <t-list :split="true" v-if="data.examples && data.examples.length > 0" class="w-full">
      <t-list-item :gutter="8" v-for="(_item, index) in data.examples" :key="index">
        <div class="w-80%">
          <t-input v-model="data.examples[index].sentence" placeholder="请输入例句" clearable/>
          <t-input v-model="data.examples[index].translation" placeholder="请输入翻译" clearable class="mt-8px"/>
        </div>
        <template #action>
          <t-button theme="danger" shape="square" @click="onDeleteExample(index)">
            <template #icon>
              <delete-icon/>
            </template>
          </t-button>
        </template>
      </t-list-item>
    </t-list>
    <div class="w-full flex justify-center" v-else>
      <t-empty type="empty" title="请添加例句"></t-empty>
    </div>
  </t-form-item>
</template>
<script lang="ts" setup>
import {MemoDataCardWord} from "@/editor/MemoEditor/types";
import {DeleteIcon, PlusIcon} from "tdesign-icons-vue-next";

const data = defineModel<Partial<MemoDataCardWord>>({
  default: () => ({})
});
const onAddMeaning = () => {
  if (!data.value.meaning) data.value.meaning = [];
  data.value.meaning.push({
    partOfSpeech: '',
    translation: ''
  });
};
const onDeleteMeaning = (index: number) => {
  if (!data.value.meaning) return;
  data.value.meaning.splice(index, 1);
};
const onAddExample = () => {
  if (!data.value.examples) data.value.examples = [];
  data.value.examples.push({
    sentence: '',
    translation: ''
  });
};
const onDeleteExample = (index: number) => {
  if (!data.value.examples) return;
  data.value.examples.splice(index, 1);
};
</script>
<style scoped lang="less">

</style>
