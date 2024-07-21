<template>
    <div class="app kb-note">
        <div class="option">
            <div style="width: 50%;max-width: 230px">
                <a-tree-select :data="folderTree" v-model="folder" :loading="loading"/>
            </div>
            <a-space>
                <a-tooltip content="编辑时开启，以优化编辑体验" position="br">
                    <a-switch v-model="isFocus" type="round">
                        <template #checked>聚焦</template>
                        <template #unchecked>失焦</template>
                    </a-switch>
                </a-tooltip>
                <a-button @click="onReset()" :loading="loading">重置</a-button>
                <a-popconfirm content="二次确认" @ok="onSubmit()" ok-text="新建" position="br">
                    <a-button type="primary" :loading="loading">新建</a-button>
                </a-popconfirm>
            </a-space>
        </div>
        <div class="container kb-wang-editor">
            <rich-text-editor v-model="content"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {_addArticle} from "@/pages/home/components/he-context";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import RichTextEditor from '@/editor/RichTextEditor/index.vue';

useGlobalStore().initDarkColors();
useArticleStore().init();
useFolderStore().init();

const folder = ref(0);
const loading = ref(false);
const isFocus = ref(false);
const content = ref('');

const folderTree = computed(() => useFolderStore().folderTree);


function onReset() {
    content.value = '';
}

function onSubmit() {
    onAdd(content.value);
    content.value = '';
}

function onAdd(html: string) {
    loading.value = true;
    _addArticle(folder.value, ArticleTypeEnum.RICH_TEXT, html)
        .then(() => {
            MessageUtil.success("新建成功");
            onReset();
        })
        .catch(e => MessageUtil.error("新建失败", e))
        .finally(() => loading.value = false);
}


</script>
<style scoped lang="less">
.kb-note {
    background-color: var(--color-bg-1);

    .option {
        display: flex;
        justify-content: space-between;
        padding: 7px;
    }

    .container {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 7px;

        .note {
            position: relative;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
