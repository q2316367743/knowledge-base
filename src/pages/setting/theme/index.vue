<template>
    <div class="more-setting-theme">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="背景图片">
                <a-input-group>
                    <a-input v-model="instance.backgroundImage" placeholder="图片地址" style="width: 400px;"/>
                    <a-button type="primary">本地图片</a-button>
                </a-input-group>
            </a-form-item>
            <a-form-item label="背景颜色">
                <color-picker v-model="instance.bgColor" />
            </a-form-item>
            <a-form-item label="文字">
                <color-picker v-model="instance.textColor" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="save()">保存</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import MessageUtil from "@/utils/MessageUtil";
import { renderHelp} from "@/store/db/BaseSettingStore";
import {clone} from "xe-utils";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {getDefaultThemeSetting} from "@/entity/setting/ThemeSetting";
import ColorPicker from "@/components/color-picker/index.vue";

export default defineComponent({
    name: 'more-setting-theme',
    components: {ColorPicker},
    emits: ['save'],
    data: () => ({
        instance: getDefaultThemeSetting()
    }),
    computed: {
        ...mapState(useThemeSettingStore, ['themeSetting']),
    },
    created() {
        this.instance = clone(this.themeSetting, true);
    },
    methods: {
        renderHelp,
        save() {
            useThemeSettingStore().save(this.instance)
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e))
                .finally(() => this.$emit('save'));
        }
    }
});
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
