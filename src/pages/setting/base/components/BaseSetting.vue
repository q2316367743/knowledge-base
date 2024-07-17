<template>
    <div class="more-setting-base">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="图片上传策略">
                <a-radio-group v-model="instance.imageStrategy">
                    <a-radio :value="ImageStrategyEnum.INNER">内部实现</a-radio>
                    <a-radio :value="ImageStrategyEnum.IMAGE" :disabled="isWeb">插件【图床】</a-radio>
                    <a-radio :value="ImageStrategyEnum.LSKY_PRO" :disabled="!isAvailable">兰空图床(推荐)</a-radio>
                </a-radio-group>
                <template #help>
                    <span v-if="instance.imageStrategy === ImageStrategyEnum.INNER">
                        <span v-if="isUtools">markdown图片上传到插件内部，占用个人存储空间，最大图片仅支持10m，富文本将转为base64存储在文章中，文章最大1m，请谨慎上传</span>
                        <span v-else>转为base64存储到文章中</span>
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
            <a-divider>新建文章</a-divider>
            <a-form-item label="新建文章是否自动命名">
                <a-switch v-model="instance.newArticleAutoName" type="round">
                    <template #checked>是</template>
                    <template #unchecked>否</template>
                </a-switch>
            </a-form-item>
            <a-form-item label="新建文章名模板" v-if="instance.newArticleAutoName">
                <a-space>
                    <a-input v-model="instance.newArticleTemplateByName" allow-clear style="width: 400px;"/>
                    <a-button type="primary" @click="openCustomerFileNameDrawer()">
                        更多
                    </a-button>
                </a-space>
                <template #help>
                    [YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z] => YYYYescape 2019-01-25T00:00:00-02:00Z
                </template>
            </a-form-item>
            <a-form-item label="默认代码拓展名" v-if="instance.newArticleAutoName">
                <a-input v-model="instance.codeExtraName" allow-clear style="width: 200px;"/>
            </a-form-item>
            <a-divider>markdown编辑器设置</a-divider>
            <a-form-item label="md编辑器是否启用经典换行">
                <a-switch v-model="instance.classicBr"/>
                <template #help v-if="instance.classicBr">
                    一个换行会被忽略，两个以上连续换行会分割成段落，
                </template>
                <template #help v-else>
                    一个换行会转成&lt;br&gt;，两个连续换行会分割成段落，三个以上连续换行会转成&lt;br&gt;并分割段落
                </template>
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
                        开启后，md编辑器默认是预览模式，想要编辑需要在右上角切换模式
                    </span>
                </template>
            </a-form-item>
            <a-divider>动作设置</a-divider>
            <a-form-item label="待办文章动作">
                <a-radio-group v-model="instance.todoArticleAction">
                    <a-radio :value="ArticleActionEnum.TO_ARTICLE">前往文章</a-radio>
                    <a-radio :value="ArticleActionEnum.DRAWER">侧边预览</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="关联文章动作">
                <a-radio-group v-model="instance.relationArticleAction">
                    <a-radio :value="ArticleActionEnum.TO_ARTICLE">前往文章</a-radio>
                    <a-radio :value="ArticleActionEnum.DRAWER">侧边预览</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="表格组件初始化表格大小">
                <a-input-number v-model="instance.tableColumnCount" placeholder="请输入列数" style="width: 120px" :min="1">
                    <template #suffix>
                        列
                    </template>
                </a-input-number>
                <span style="margin: 0 14px"> X </span>
                <a-input-number v-model="instance.tableColCount" placeholder="请输入行数" style="width: 120px" :min="1">
                    <template #suffix>
                        行
                    </template>
                </a-input-number>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="save()">保存</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {clone} from "xe-utils";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import Constant from "@/global/Constant";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {isUtools} from "@/global/BeanFactory";
import {useRouter} from "vue-router";
import {ArticleActionEnum} from "@/entity/setting/BaseSetting";
import {openCustomerFileNameDrawer} from "@/pages/setting/base/drawer/CustomerFileNameDrawer";

const router = useRouter();

const instance = ref(clone(useBaseSettingStore().baseSetting, true));
const isWeb = !isUtools;
const isAvailable = computed(() => useLskyProSettingStore().isAvailable);

function save() {
    // 校验图床
    if (instance.value.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
        if (!useLskyProSettingStore().isAvailable) {
            MessageBoxUtil.confirm("检测到您未配置兰空图床，是否立即前往配置?", "错误")
                .then(() => router.push("/setting/lsky-pro"))
            return;
        }
    }
    useBaseSettingStore().save(instance.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}

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
