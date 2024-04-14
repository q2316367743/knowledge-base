<template>
    <div class='setting-modal'>
        <div class='header'>
            <span>
                <a-button type='text' :loading="loading" @click="onClose">
                    <template #icon><icon-left/></template>
                </a-button>
                <span style="margin-left: 7px">设置</span>
            </span>
            <a-button type='text' :loading="loading" @click="onSave">
                <template #icon>
                    <icon-save/>
                </template>
            </a-button>
        </div>
        <div class='container'>
            <a-alert style="margin-bottom: 7px;" type="warning" v-if="todoCategoryTree.length === 0">请前往【知识库】中新增待办清单</a-alert>
            <a-form-item :model="{}" layout='vertical'>
                <a-form-item label='当前清单'>
                    <a-tree-select :data="todoCategoryTree" allow-clear allow-search
                                   v-model="setting.categoryId">
                    </a-tree-select>
                    <template #help>请选择待办清单，请勿选择待办文件夹</template>
                </a-form-item>
            </a-form-item>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useSettingStore} from "@/nested/todo/store";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const setting = ref(useSettingStore().getSetting());
const loading = ref(false);

const {todoCategoryTree, todoCategoryMap} = useTodoCategoryStore();

function onClose() {
    router.push('/home')
}

function onSave() {
    const todoCategory = todoCategoryMap.get(setting.value.categoryId || 0);
    if (todoCategory && todoCategory.type !== TodoCategoryTypeEnum.TODO) {
        MessageUtil.success("请选择待办清单，不能选择待办文件夹");
        return;
    }
    loading.value = true;
    useSettingStore().save(setting.value)
        .then(() => {
            MessageUtil.success("保存成功");
            onClose();
        }).catch(e => MessageUtil.error("保存失败", e))
        .finally(() => loading.value = false);
}
</script>
<style scoped lang="less">
.setting-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--color-text-1);

    .header {
        border-bottom: 1px solid var(--color-border);
        display: flex;
        justify-content: space-between;
        padding-bottom: 7px;
    }

    .container {
        position: absolute;
        top: 46px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding: 7px;
    }
}

</style>
