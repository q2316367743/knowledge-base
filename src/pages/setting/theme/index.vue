<template>
    <div class="more-setting-theme">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="背景图片">
                <a-input v-model="instance.backgroundImage" placeholder="图片地址" style="width: 400px;"/>
            </a-form-item>
            <a-form-item label="背景颜色">
                <color-picker v-model="instance.bgColor"/>
            </a-form-item>
            <a-form-item label="文字">
                <color-picker v-model="instance.textColor"/>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="save()">保存</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "xe-utils";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import ColorPicker from "@/components/color-picker/index.vue";
import {useFileSystemAccess} from "@vueuse/core";

const emits = defineEmits(['save']);

const instance = ref(clone(useThemeSettingStore().themeSetting, true));

function save() {
    useThemeSettingStore().save(instance.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e))
        .finally(() => emits('save'));
}

const file = useFileSystemAccess({
    dataType: 'Blob',
    types: [{
        description: '图片',
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        }
    }]
})

</script>
<style scoped>
.more-setting-theme {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
    overflow: auto;
}

</style>
