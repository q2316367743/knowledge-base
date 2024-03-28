<template>
    <div class="more-setting-base">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="编辑文章是否自动收起菜单">
                <a-switch v-model="instance.autoCollapsedByEditor" type="round">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
                <template #help>
                    当插件宽度小于1080px时生效
                </template>
            </a-form-item>
            <a-form-item label="点击待办是否自动收起菜单">
                <a-switch v-model="instance.autoCollapsedByTodo" type="round">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
                <template #help>
                    当插件宽度小于1080px时生效
                </template>
            </a-form-item>
            <a-form-item label="新建文章是否自动命名">
                <a-switch v-model="instance.newArticleAutoName" type="round">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
            </a-form-item>
            <a-form-item label="新建文章名模板" v-if="instance.newArticleAutoName">
                <a-input v-model="instance.newArticleTemplateByName" allow-clear style="width: 400px;"/>
                <template #help>
                    [YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z] => YYYYescape 2019-01-25T00:00:00-02:00Z
                </template>
            </a-form-item>
            <a-form-item label="默认代码拓展名" v-if="instance.newArticleAutoName">
                <a-input v-model="instance.codeExtraName" allow-clear style="width: 200px;"/>
            </a-form-item>
            <a-form-item label="md编辑器默认编辑模式">
                <a-radio-group v-model="instance.mdEditorEditMode">
                    <a-radio :value="MdEditorEditModeEnum.EDIT_ONLY">仅编辑</a-radio>
                    <a-radio :value="MdEditorEditModeEnum.EDIT_PREVIEW">编辑和预览</a-radio>
                    <a-radio :value="MdEditorEditModeEnum.AUTO">自动切换</a-radio>
                    <a-radio :value="MdEditorEditModeEnum.PREVIEW">仅预览</a-radio>
                </a-radio-group>
                <template #help>
                    <span v-if="instance.mdEditorEditMode === MdEditorEditModeEnum.AUTO">
                        当插件宽度小于{{ Constant.autoCollapsedWidth }}px时切换为【仅编辑】，
                        大于{{ Constant.autoCollapsedWidth }}px时切换为【编辑和预览】
                    </span>
                    <span v-else-if="instance.mdEditorEditMode === MdEditorEditModeEnum.PREVIEW">
                        开启后，md编辑器默认是预览模式，如果文章不是预览吗模式，则需要点击两边预览/编辑切换才可以切换到编辑模式，请谨慎开启
                    </span>
                </template>
            </a-form-item>
            <a-form-item label="待办文章动作">
                <a-radio-group v-model="instance.todoArticleAction">
                    <a-radio :value="TodoArticleActionEnum.TO_ARTICLE">前往文章</a-radio>
                    <a-radio :value="TodoArticleActionEnum.DRAWER">侧边预览</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="关联文章动作">
                <a-radio-group v-model="instance.relationArticleAction">
                    <a-radio :value="TodoArticleActionEnum.TO_ARTICLE">前往文章</a-radio>
                    <a-radio :value="TodoArticleActionEnum.DRAWER">侧边预览</a-radio>
                </a-radio-group>
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
import MessageUtil from "@/utils/modal/MessageUtil";
import JsonTheme from "@/global/CodeTheme";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {clone} from "xe-utils";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import Constant from "@/global/Constant";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {isUtools} from "@/global/BeanFactory";
import {getDefaultBaseSetting, ArticleActionEnum} from "@/entity/setting/BaseSetting";

export default defineComponent({
    name: 'more-setting-base',
    emits: ['save'],
    data: () => ({
        JsonTheme, Constant,
        ImageStrategyEnum,
        instance: getDefaultBaseSetting(),
        isUtools
    }),
    computed: {
        TodoArticleActionEnum() {
            return ArticleActionEnum
        },
        MdEditorEditModeEnum() {
            return MdEditorEditModeEnum
        },
        ...mapState(useBaseSettingStore, ['baseSetting']),
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
        },
        openLocalImagePath() {
            MessageBoxUtil.alert("由于富文本编辑器的限制，导致无法将图片上传到utools内部，所以只能存放到本地中，因此，富文本编辑器的图片目前无法实现同步功能", "本地图片须知")
        },
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
