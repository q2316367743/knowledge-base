<template>
  <t-alert style="margin-bottom: 7px">
    当选中文字呼出超级面板或复制文字呼出搜索面板时，新增关键字：【新增笔记】
  </t-alert>
  <t-form :model="instance" >
    <t-form-item label="最小文字长度" label-align="top">
      <t-input-number :disabled="instance.enable" v-model="instance.minLength" :min="1"/>
    </t-form-item>
    <t-form-item label="最大文字长度" label-align="top">
      <t-input-number :disabled="instance.enable" v-model="instance.maxLength" :min="instance.minLength"/>
    </t-form-item>
    <t-form-item label-align="top">
      <t-button theme="primary" v-if="instance.enable" status="danger" @click="close()">关闭</t-button>
      <t-button theme="primary" v-else @click="open()">开启</t-button>
    </t-form-item>
  </t-form>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";


const instance = ref({
  minLength: 20,
  maxLength: 999999,
  enable: false
});

const feature = InjectionUtil.feature.getFeatureOne(Constant.feature.ADD);
if (feature) {
  const cmd = feature.cmds[0];
  instance.value = {
    maxLength: typeof cmd !== 'string' ? cmd.maxLength || 999999 : 999999,
    minLength: typeof cmd !== 'string' ? cmd.minLength || 999999 : 999999,
    enable: true
  }
}

function open() {
  const res = InjectionUtil.feature.setFeatureOneSimple(Constant.feature.ADD, {
    type: "over",
    label: "新增笔记",
    minLength: instance.value.minLength,
    maxLength: instance.value.maxLength
  });
  if (res) {
    // 设置成功
    MessageUtil.success("设置关键字成功");
    instance.value.enable = true;
  }
}

function close() {
  const res = InjectionUtil.feature.removeFeatureOne(Constant.feature.ADD);
  if (res) {
    MessageUtil.success("移除关键字成功");
    instance.value.enable = false;
  }
}
</script>
<style scoped>

</style>
