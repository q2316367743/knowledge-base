<template>
    <a-tooltip content="设置">
        <a-button type="primary" @click="open()">
            <template #icon>
                <icon-settings/>
            </template>
        </a-button>
    </a-tooltip>
    <a-drawer v-model:visible="visible" title="工作空间设置" :width="400" ok-text="保存" @ok="submit()">
        <a-form :model="setting" layout="vertical">
            <a-form-item label="是否使用自定义markdown编辑器">
                <a-radio-group v-model="setting.customerMarkdown" type="button">
                    <a-radio :value="true">cherry markdown</a-radio>
                    <a-radio :value="false">monaco editor</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="markdown编辑器类型" :disabled="!setting.customerMarkdown">
                <a-radio-group v-model="setting.markdownEditOnly" type="button">
                    <a-radio :value="true">只有编辑器</a-radio>
                    <a-radio :value="false">编辑器+预览</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useWorkspaceSettingStore} from "@/store/setting/WorkspaceSettingStore";
import {clone} from "xe-utils";
import MessageUtil from "@/utils/MessageUtil";

const visible = ref(false);
const setting = ref(clone(useWorkspaceSettingStore().setting, true));

function open() {
    visible.value = true;
    setting.value = clone(useWorkspaceSettingStore().setting, true);
}

function submit() {
    useWorkspaceSettingStore().save(setting.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}

</script>
<style scoped>

</style>
