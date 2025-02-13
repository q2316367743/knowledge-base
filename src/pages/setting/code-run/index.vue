<template>
  <page-layout title="代码运行设置">
    <template #extra>
      <a-space>
        <a-button type="text" @click="addCodeRunCommand">
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
        <a-button type="text" status="success" @click="openCodeRunInfo">
          <template #icon>
            <icon-question-circle/>
          </template>
        </a-button>
      </a-space>
    </template>
    <a-list :bordered="false">
      <a-list-item v-for="item in list" :key="item.key">
        <a-list-item-meta :title="item.key" :description="item.value"/>
        <template #actions>
          <a-button type="text" @click="updateCodeRunCommand(item.key, item.value)">
            <template #icon>
              <icon-edit/>
            </template>
          </a-button>
          <a-button type="text" status="danger" @click="deleteCodeRunCommand(item.key)">
            <template #icon>
              <icon-delete/>
            </template>
          </a-button>
        </template>
      </a-list-item>
    </a-list>
  </page-layout>
</template>
<script lang="ts" setup>
import {listify} from "radash";
import {codeRunSetting} from "@/plugin/CodeRun";
import {addCodeRunCommand, deleteCodeRunCommand, updateCodeRunCommand} from "@/pages/setting/code-run/modal";
import {openCodeRunInfo} from "@/pages/setting/code-run/info";

interface CodeRunItem {
  key: string;
  value: string;
}

const list = computed<Array<CodeRunItem>>(() => {
  return listify(codeRunSetting.value, (key, value) => ({key, value}));
})
</script>
<style scoped lang="less">

</style>
