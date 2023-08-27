<template>
    <a-alert style="margin-bottom: 7px">
        当选中文字呼出超级面板或复制文字呼出搜索面板时，新增关键字：【新增文章】
    </a-alert>
    <a-form :model="instance" layout="vertical">
        <a-form-item label="最小文字长度">
            <a-input-number :disabled="instance.enable" v-model="instance.minLength" :min="1"/>
        </a-form-item>
        <a-form-item label="最大文字长度">
            <a-input-number :disabled="instance.enable" v-model="instance.maxLength" :min="instance.minLength"/>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" v-if="instance.enable" status="danger" @click="close()">关闭</a-button>
            <a-button type="primary" v-else @click="open()">开启</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import Constant from "@/global/Constant";
import {getFeatureOne, removeFeatureOne, setFeatureOne} from "@/utils/utools/FeatureUtil";
import MessageUtil from "@/utils/MessageUtil";


const instance = ref({
    minLength: 20,
    maxLength: 999999,
    enable: false
});

const feature = getFeatureOne(Constant.feature.ADD);
if (feature) {
    instance.value = {
        maxLength: feature.cmds[0].maxLength || 999999,
        minLength: feature.cmds[0].minLength || 20,
        enable: true
    }
}

function open() {
    const res = setFeatureOne(Constant.feature.ADD, {
        type: "over",
        label: "新增文章",
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
    const res = removeFeatureOne(Constant.feature.ADD);
    if (res) {
        MessageUtil.success("移除关键字成功");
        instance.value.enable = false;
    }
}
</script>
<style scoped>

</style>
