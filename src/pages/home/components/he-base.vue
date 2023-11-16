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
            <a-form-item label="分类">
                <a-tree-select v-model="categoryId" placeholder="请选择分类" scrollbar allow-clear
                               :data="categoryTree" allow-search>
                </a-tree-select>
            </a-form-item>
            <a-form-item label="标签">
                <a-select v-model="base.tags" placeholder="请输入标签" multiple scrollbar allow-clear
                          allow-search
                          allow-create>
                </a-select>
                <template #help>
                    按回车新增标签
                </template>
            </a-form-item>
            <a-form-item label="描述">
                <a-textarea v-model="base.description" :auto-size="{minRows: 4}"
                            placeholder="请输入描述，不能超过64个字"
                            allow-clear :max-length="64" show-word-limit/>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {getDefaultArticleBase} from "@/entity/article";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import MessageUtil from "@/utils/MessageUtil";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useCategoryStore} from "@/store/db/CategoryStore";

const props = defineProps({
    modelValue: Boolean
});
const emit = defineEmits(['update:modelValue']);

const extraVisible = ref(false);
const categoryId = ref<number | undefined>(undefined);
const base = ref(getDefaultArticleBase());
let rev: undefined | string = undefined;

const categoryTree = computed(() => useCategoryStore().categoryTree);

function init(id: number) {
    if (id === 0) {
        base.value = getDefaultArticleBase();
        rev = undefined;
        return;
    }
    const articleIndex = useArticleStore().articleMap.get(id);
    if (articleIndex) {
        categoryId.value = articleIndex.categoryId;
    } else {
        categoryId.value = undefined;
    }
    getFromOneWithDefaultByAsync(LocalNameEnum.ARTICLE_BASE + useHomeEditorStore().id, getDefaultArticleBase())
        .then(res => {
            base.value = res.record;
            rev = res.rev;
        });
}

watch(() => props.modelValue, value => {
    extraVisible.value = (value || false);
    if (extraVisible.value) {
        // 查询
        init(useHomeEditorStore().id);
    }
});
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
    rev = await useArticleStore().updateBase(useHomeEditorStore().id, {
        categoryId: categoryId.value
    }, base.value, rev);
}
</script>
<style scoped>

</style>
