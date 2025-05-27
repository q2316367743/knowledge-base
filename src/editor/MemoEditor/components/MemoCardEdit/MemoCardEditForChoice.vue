<template>
  <t-form-item label="问题" label-align="top">
    <t-input v-model="data.question" placeholder="请输入问题" clearable/>
  </t-form-item>
  <t-form-item label-align="top">
    <template #label>
      <div class="flex justify-between">
        <div>状态</div>
        <t-button theme="primary" variant="text" size="small" @click="onAddOption">
          <template #icon>
            <plus-icon/>
          </template>
          添加选项
        </t-button>
      </div>
    </template>
    <div v-if="data.options && data.options.length > 0" class="flex flex-col w-full gap-8px first:mt-8px">
      <div v-for="(_item, index) in data.options" :key="index" class="w-full flex items-center">
        <div class="w-32px">{{ getNo(index) }}</div>
        <t-input v-model="data.options[index].label"
                 placeholder="请输入选项" clearable/>
        <simple-checkbox v-model="data.options[index].value" class="ml-8px"/>
        <t-button theme="danger" class="ml-8px" shape="square" @click="onDeleteOption(index)">
          <template #icon>
            <delete-icon />
          </template>
        </t-button>
      </div>
    </div>
    <div class="w-full flex justify-center" v-else>
      <t-empty type="empty" title="请添加选项" ></t-empty>
    </div>
  </t-form-item>
  <t-form-item label="解析" label-align="top">
    <t-textarea v-model="data.analysis" placeholder="请输入解析。注意：选项在练习时顺序是随机的"
                :autosize="{minRows: 3, maxRows: 5}"/>
  </t-form-item>
</template>
<script lang="ts" setup>
import {MemoDataCardChoice} from "@/editor/MemoEditor/types";
import {DeleteIcon, PlusIcon} from "tdesign-icons-vue-next";
import {getNo} from "@/utils/lang/FieldUtil";

const data = defineModel<Partial<MemoDataCardChoice>>({
  default: () => ({})
});
const onAddOption = () => {
  if (!data.value.options) {
    data.value.options = [];
  }
  data.value.options.push({
    label: '',
    value: false
  })
};
const onDeleteOption = (index: number) => {
  if (!data.value.options) {
    data.value.options = [];
  }
  data.value.options.splice(index, 1);
}
</script>
<style scoped lang="less">

</style>
