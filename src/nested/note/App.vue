<template>
    <div class="app kb-note">
        <div class="container kb-wang-editor">
            <div ref="noteRef" class="note"/>
        </div>
        <div class="option">
            <div style="width: 50%;max-width: 230px">
                <a-tree-select :data="folderTree" size="mini" v-model="folder" :loading="loading"/>
            </div>
            <a-space>
                <a-button size="mini" @click="onReset()" :loading="loading">重置</a-button>
                <a-popconfirm content="二次确认" @ok="onSubmit()" ok-text="新建">
                    <a-button size="mini" type="primary" :loading="loading">新建</a-button>
                </a-popconfirm>
            </a-space>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {computed, onMounted, ref, shallowRef} from "vue";
import {IDomEditor} from "@wangeditor/editor";
import {buildRickText} from "@/nested/note/func";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {_addArticle} from "@/pages/home/components/he-context";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

useGlobalStore().initDarkColors();
useArticleStore().init();
useFolderStore().init();

const folder = ref(0);
const noteRef = ref<HTMLDivElement>();
const instance = shallowRef<IDomEditor>();
const loading = ref(false);


const folderTree = computed(() => useFolderStore().folderTree);

onMounted(() => {
    instance.value = buildRickText(noteRef);
});

function onReset() {
    instance.value && instance.value.setHtml("")
}

function onSubmit() {
    if (instance.value) {
        const text = instance.value.getText();
        const html = instance.value.getHtml();
        if (text.trim() === '') {
            if (html.indexOf("img") > -1) {
                onAdd(html)
            } else {
                onAdd(html)
            }
        } else {
            onAdd(html)
        }
        // 重置
    } else {
        MessageUtil.error("系统异常，编辑器实例未找到");
    }
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
    .container {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        bottom: 38px;

        .note {
            position: relative;
            height: 100%;
            width: 100%;
        }
    }

    .option {
        position: absolute;
        left: 7px;
        right: 7px;
        bottom: 7px;
        display: flex;
        justify-content: space-between;
    }
}
</style>
