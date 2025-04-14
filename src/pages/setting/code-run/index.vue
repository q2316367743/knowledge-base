<template>
  <page-layout title="代码运行设置">
    <template #extra>
      <t-space>
        <t-button variant="text" theme="primary" shape="square" @click="addCodeRunCommand">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
        <t-button variant="text" theme="success" shape="square" @click="infoVisible = true">
          <template #icon>
            <questionnaire-icon/>
          </template>
        </t-button>
      </t-space>
    </template>
    <t-list :bordered="false">
      <t-list-item v-for="item in list" :key="item.key">
        <t-list-item-meta :title="item.key" :description="item.value"/>
        <template #action>
          <t-button variant="text" theme="primary" shape="square" @click="updateCodeRunCommand(item.key, item.value)">
            <template #icon>
              <edit2-icon/>
            </template>
          </t-button>
          <t-button variant="text" theme="danger" shape="square" @click="deleteCodeRunCommand(item.key)">
            <template #icon>
              <delete-icon/>
            </template>
          </t-button>
        </template>
      </t-list-item>
    </t-list>
    <code-run-info v-model="infoVisible"/>
  </page-layout>
</template>
<script lang="ts" setup>
import {listify} from "radash";
import {codeRunSetting} from "@/plugin/CodeRun";
import {addCodeRunCommand, deleteCodeRunCommand, updateCodeRunCommand} from "@/pages/setting/code-run/modal";
import CodeRunInfo from "@/pages/setting/code-run/CodeRunInfo.vue";
import {DeleteIcon, Edit2Icon, PlusIcon, QuestionnaireIcon} from "tdesign-icons-vue-next";

interface CodeRunItem {
  key: string;
  value: string;
}

const infoVisible = ref(false);

const list = computed<Array<CodeRunItem>>(() => {
  return listify(codeRunSetting.value, (key, value) => ({key, value}));
})
</script>
<style scoped lang="less">

</style>
