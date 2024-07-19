<template>
    <a-layout class="app kb-canvas">
        <a-layout-header class="header">
            <div style="width: 50%;max-width: 230px">
                <a-tree-select :data="folderTree" v-model="folder" :loading="loading"/>
            </div>
            <a-space>
                <a-button :loading="loading" status="danger" @click="onReset">重置</a-button>
                <a-popconfirm content="二次确认" ok-text="新建" position="br" @ok="onAdd">
                    <a-button type="primary" :loading="loading" style="margin-right: 17px">新建</a-button>
                </a-popconfirm>
            </a-space>
        </a-layout-header>
        <a-layout-content class="container">
            <drauu-editor v-model="content" :read-only="false" :article-id="id" v-if="init"/>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {computed, nextTick, ref} from "vue";
import DrauuEditor from "@/editor/DrauuEditor/index.vue";
import {_addArticle} from "@/pages/home/components/he-context";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import MessageUtil from "@/utils/modal/MessageUtil";

useGlobalStore().initDarkColors();
useArticleStore().init();
useFolderStore().init();

const folder = ref(0);
const init = ref(true);
const loading = ref(false);
const id = ref(0)
const content = ref('');

const folderTree = computed(() => useFolderStore().folderTree);

function onReset() {
    init.value = false;
    nextTick(() => {
        content.value = '';
        init.value = true;
    });
}

function onAdd() {
    loading.value = true;
    _addArticle(folder.value, ArticleTypeEnum.DRAUU, content.value)
        .then(() => {
            MessageUtil.success("新建成功");
            onReset()
        })
        .catch(e => MessageUtil.error("新建失败", e))
        .finally(() => loading.value = false);
}


</script>
<style scoped lang="less">
.kb-canvas {
    background-color: var(--color-bg-1);
    .header {
        display: flex;
        justify-content: space-between;
    }
    .container {
        position: absolute;
        top: 46px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>
