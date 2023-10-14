<template>
    <!-- 额外信息 -->
    <a-drawer v-model:visible="extraVisible" title="信息" :width="300" ok-text="保存" @ok="save()">
        <a-form :model="base" layout="vertical">
            <a-form-item label="来源">
                <a-input v-model="base.source" :max-length="32"/>
                <template #help>
                    最大32个字
                </template>
            </a-form-item>
            <a-form-item label="来源链接">
                <a-input v-model="base.sourceUrl" :max-length="255"/>
            </a-form-item>
            <a-form-item label="标签">
                <a-select v-model="base.tags" placeholder="请输入标签" multiple scrollbar allow-clear
                          allow-search
                          allow-create>
                </a-select>
            </a-form-item>
            <a-form-item label="描述">
                <a-textarea v-model="base.description" :auto-size="{minRows: 4}"
                            placeholder="请输入描述，不能超过64个字"
                            allow-clear :max-length="64" show-word-limit/>
            </a-form-item>
            <a-divider>额外信息</a-divider>
            <a-form-item label="自定义设置">
                <a-switch v-model="base.customer"/>
            </a-form-item>
            <a-form-item v-if="base.customer" label="文章主题">
                <a-select v-model="base.articleTheme" style="width: 200px">
                    <a-option :value="ArticleThemeEnum.TAILWIND_BLUE">天空蓝</a-option>
                    <a-option :value="ArticleThemeEnum.JUE_JIN">掘金</a-option>
                    <a-option :value="ArticleThemeEnum.CHANNING_CYAN">柠青</a-option>
                    <a-option :value="ArticleThemeEnum.CHINESE_RED">中国红</a-option>
                    <a-option :value="ArticleThemeEnum.CONDENSED_NIGHT_PURPLE">凝夜紫</a-option>
                    <a-option :value="ArticleThemeEnum.DEVUI_BLUE">科技蓝</a-option>
                    <a-option :value="ArticleThemeEnum.GEEK_BLACK">极客黑</a-option>
                    <a-option :value="ArticleThemeEnum.JZMAN">jzman</a-option>
                    <a-option :value="ArticleThemeEnum.SMART_BLUE">灵动蓝</a-option>
                    <a-option :value="ArticleThemeEnum.V_GREEN">微绿</a-option>
                    <a-option :value="ArticleThemeEnum.VUEPRESS">vuepress</a-option>
                    <a-option :value="ArticleThemeEnum.HE_TI">赫蹏</a-option>
                    <a-option :value="ArticleThemeEnum.GITHUB">Github</a-option>
                    <a-option :value="ArticleThemeEnum.ZUI">Zui</a-option>
                </a-select>
                <template #help>
                    <span v-html="renderHelp(base.articleTheme)"></span>
                </template>
            </a-form-item>
            <a-form-item v-if="base.customer" label="文章头部是否显示">
                <a-switch v-model="base.articleHeaderVisible"/>
            </a-form-item>
            <a-form-item v-if="base.customer" label="代码是否换行">
                <a-switch v-model="base.codeWrap">
                    <template #checked>换行</template>
                    <template #unchecked>滚动</template>
                </a-switch>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts" setup>
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import {renderHelp} from "@/store/db/BaseSettingStore";
import {computed, ref, watch} from "vue";
import {getDefaultArticleBaseByBaseSetting, getDefaultArticleIndex} from "@/entity/article";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import MessageUtil from "@/utils/MessageUtil";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const props = defineProps({
    modelValue: Boolean
});
const emit = defineEmits(['update:modelValue']);

const extraVisible = ref(false);
const base = ref(getDefaultArticleBaseByBaseSetting());
let rev: undefined | string = undefined;

watch(() => useHomeEditorStore().id, value => init(value));

init(useHomeEditorStore().id);

function init(id: number) {
    if (id === 0) {
        base.value = getDefaultArticleBaseByBaseSetting();
        rev = undefined;
        return;
    }
    getFromOneByAsync(LocalNameEnum.ARTICLE_BASE + useHomeEditorStore().id, getDefaultArticleBaseByBaseSetting())
        .then(res => {
            base.value = res.record;
            rev = res.rev;
        });
}

watch(() => props.modelValue, value => extraVisible.value = (value || false));
watch(() => extraVisible.value, value => emit('update:modelValue', value));

function save() {
    if (useHomeEditorStore().id === 0) {
        return;
    }
    _save().then(() => {
        MessageUtil.success("保存文章成功");
    })
        .catch(e => MessageUtil.error("保存文章失败", e))
        .finally(() => extraVisible.value = false);
}

async function _save() {
    rev = await useArticleStore().updateBase(useHomeEditorStore().id, {}, base.value, rev);
}
</script>
<style scoped>

</style>
