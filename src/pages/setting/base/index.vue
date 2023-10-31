<template>
    <div class="more-setting-base">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="JSON视图白天主题">
                <a-select v-model="instance.codeLightTheme" style="width: 200px">
                    <a-option v-for="theme in JsonTheme.light" :label="theme" :value="theme"/>
                </a-select>
            </a-form-item>
            <a-form-item label="JSON视图黑夜主题">
                <a-select v-model="instance.codeDarkTheme" style="width: 200px">
                    <a-option v-for="theme in JsonTheme.dark" :label="theme" :value="theme"/>
                </a-select>
            </a-form-item>
            <a-form-item label="文章主题">
                <a-select v-model="instance.articleTheme" style="width: 200px">
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
                    <span v-html="renderHelp(instance.articleTheme)"></span>
                </template>
            </a-form-item>
            <a-form-item label="文章头部是否显示">
                <a-switch v-model="instance.articleHeaderVisible"/>
            </a-form-item>
            <a-form-item label="代码是否换行">
                <a-switch v-model="instance.codeWrap">
                    <template #checked>换行</template>
                    <template #unchecked>滚动</template>
                </a-switch>
            </a-form-item>
            <a-form-item label="图片上传策略">
                <a-radio-group v-model="instance.imageStrategy">
                    <a-radio :value="ImageStrategyEnum.INNER">
                        内部实现
                    </a-radio>
                    <a-radio :value="ImageStrategyEnum.IMAGE">插件【图床】</a-radio>
                </a-radio-group>
                <template #help>
                    <span v-if="instance.imageStrategy === ImageStrategyEnum.INNER">
                        上传到插件内部，占用个人存储空间，最大图片仅支持10m
                    </span>
                    <span v-else-if="instance.imageStrategy === ImageStrategyEnum.IMAGE">
                        需要安装插件【图床】
                    </span>
                </template>
            </a-form-item>
            <a-form-item label="编辑文章是否自动收起菜单">
                <a-switch v-model="instance.authCollapsed">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
                <template #help>
                    当插件宽度小于1080px时生效
                </template>
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
import JsonTheme from "@/global/CodeTheme";
import {getDefaultBaseSetting, renderHelp, useBaseSettingStore} from "@/store/db/BaseSettingStore";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {clone} from "xe-utils";
import {isUtools} from '@/global/BeanFactory';

export default defineComponent({
    name: 'more-setting-base',
    emits: ['save'],
    data: () => ({
        JsonTheme,
        ArticleThemeEnum,
        ImageStrategyEnum,
        isUtools,
        instance: getDefaultBaseSetting()
    }),
    computed: {
        ...mapState(useBaseSettingStore, ['baseSetting']),
    },
    created() {
        this.instance = clone(this.baseSetting, true);
    },
    methods: {
        renderHelp,
        save() {
            useBaseSettingStore().save(this.instance)
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e))
                .finally(() => this.$emit('save'));
        }
    }
});
</script>
<style scoped>
.more-setting-base {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
    overflow: auto;
}

</style>
