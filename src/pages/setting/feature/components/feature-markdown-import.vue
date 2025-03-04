<template>
  <t-alert style="margin-bottom: 7px">
    当选中md文件时，新增关键字：【从md导入笔记】
  </t-alert>
  <t-alert style="margin-bottom: 7px" type="warning">
    暂未实现
  </t-alert>
  <t-button theme="primary" v-if="enable" status="danger" @click="close()" :disabled="true">关闭</t-button>
  <t-button theme="primary" v-else @click="open()" :disabled="true">开启</t-button>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {getFeatureOne, removeFeatureOne, setFeatureOneSimple} from "@/utils/utools/FeatureUtil";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";

const enable = ref(false);

const feature = getFeatureOne(Constant.feature.IMPORT);
if (feature) {
  enable.value = true;
}

function open() {
  const res = setFeatureOneSimple(Constant.feature.IMPORT, {
    type: "files",
    label: "从md导入笔记",
    fileType: "file",
    match: '/.*(md|markdown)$/i',
    minLength: 1,
    maxLength: 1
  });
  if (res) {
    // 设置成功
    MessageUtil.success("设置关键字成功");
    enable.value = true;
  }
}

function close() {
  const res = removeFeatureOne(Constant.feature.IMPORT);
  if (res) {
    MessageUtil.success("移除关键字成功");
    enable.value = false;
  }
}

</script>
<style scoped>

</style>
