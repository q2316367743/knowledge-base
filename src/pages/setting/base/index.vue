<template>
    <div class="more-setting-base">
        <a-form :model="instance" layout="vertical">
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
            <a-form-item label="图片上传策略">
                <a-radio-group v-model="instance.imageStrategy">
                    <a-radio :value="ImageStrategyEnum.INNER" :disabled="isWeb">
                        内部实现
                    </a-radio>
                    <a-radio :value="ImageStrategyEnum.IMAGE" :disabled="isWeb">插件【图床】</a-radio>
                    <a-radio :value="ImageStrategyEnum.LSKY_PRO" :disabled="!isAvailable">兰空图床(推荐)</a-radio>
                </a-radio-group>
                <template #help>
                    <span v-if="instance.imageStrategy === ImageStrategyEnum.INNER">
                        上传到插件内部，占用个人存储空间，最大图片仅支持10m
                    </span>
                    <span v-else-if="instance.imageStrategy === ImageStrategyEnum.IMAGE">
                        需要安装插件【图床】
                    </span>
                    <span v-else-if="instance.imageStrategy === ImageStrategyEnum.LSKY_PRO">
                        推荐使用，需要自己部署图床服务器
                    </span>
                </template>
            </a-form-item>
            <a-form-item label="编辑文章是否自动收起菜单">
                <a-switch v-model="instance.autoCollapsedByEditor">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
                <template #help>
                    当插件宽度小于1080px时生效
                </template>
            </a-form-item>
            <a-form-item label="点击待办是否自动收起菜单">
                <a-switch v-model="instance.autoCollapsedByTodo">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
                <template #help>
                    当插件宽度小于1080px时生效
                </template>
            </a-form-item>
            <a-form-item label="新建文章名模板">
                <a-input v-model="instance.newArticleTemplateByName"/>
                <template #help>
                    [YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z] => YYYYescape 2019-01-25T00:00:00-02:00Z
                </template>
            </a-form-item>
            <a-form-item label="默认代码拓展名">
                <a-input v-model="instance.codeExtraName"/>
            </a-form-item>
            <a-form-item label="md编辑器默认编辑模式">
                <a-radio-group v-model="instance.mdEditorEditMode">
                    <a-radio :value="MdEditorEditModeEnum.EDIT_ONLY">仅编辑</a-radio>
                    <a-radio :value="MdEditorEditModeEnum.EDIT_PREVIEW">编辑和预览</a-radio>
                    <a-radio :value="MdEditorEditModeEnum.AUTO">自动切换</a-radio>
                </a-radio-group>
                <template #help>
                    <span v-if="instance.mdEditorEditMode === MdEditorEditModeEnum.AUTO">
                        当插件宽度小于{{ Constant.autoCollapsedWidth }}px时切换为【仅编辑】，
                        大于{{ Constant.autoCollapsedWidth }}px时切换为【编辑和预览】
                    </span>
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
import {getDefaultBaseSetting, renderHelp, useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {clone} from "xe-utils";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {isUtools} from "@/global/BeanFactory";

export default defineComponent({
    name: 'more-setting-base',
    emits: ['save'],
    data: () => ({
        JsonTheme, Constant,
        ArticleThemeEnum,
        ImageStrategyEnum,
        instance: getDefaultBaseSetting()
    }),
    computed: {
        MdEditorEditModeEnum() {
            return MdEditorEditModeEnum
        },
        ...mapState(useBaseSettingStore, ['baseSetting']),
        ...mapState(useLskyProSettingStore, ['isAvailable']),
        isWeb() {
            return !isUtools
        }
    },
    watch: {
        baseSetting() {
            this.instance = clone(this.baseSetting, true);
        }
    },
    created() {
        this.instance = clone(this.baseSetting, true);
    },
    methods: {
        renderHelp,
        save() {
            // 校验图床
            if (this.instance.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
                if (!useLskyProSettingStore().isAvailable) {
                    MessageBoxUtil.confirm("检测到您未配置兰空图床，是否立即前往配置?", "错误")
                        .then(() => this.$router.push("/setting/lsky-pro"))
                    return;
                }
            }
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
