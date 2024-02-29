<template>
    <header class="header">
        <div class="left">
            <a-button type="text" @click="switchCollapsed()">
                <template #icon>
                    <icon-menu/>
                </template>
            </a-button>
            <a-input v-model="title" placeholder="请输入文章标题" allow-clear
                     v-show="titleEdit && !preview"
                     @blur="clickTitleSave()" @keydown.enter="clickTitleSave()"
                     style="margin-left: 7px;" ref="titleInput"/>
            <div class="title" v-if="!titleEdit">
                <div class="title-wrap">{{ title }}</div>
                <a-button size="mini" style="margin-left: 7px;margin-top: 4px" type="text" @click="clickTitleEdit()"
                          v-if="!preview">
                    <template #icon>
                        <icon-edit/>
                    </template>
                </a-button>
            </div>
        </div>
        <a-button-group type="text">
            <a-space>
                <a-button type="text" v-if="!supportAutoSave" @click="onSave()" status="success">
                    <template #icon>
                        <icon-save/>
                    </template>
                </a-button>
                <a-trigger trigger="hover" position="br">
                    <a-button type="text">
                        <template #icon>
                            <icon-info-circle/>
                        </template>
                    </a-button>
                    <template #content>
                        <ech-toc/>
                    </template>
                </a-trigger>
                <a-button @click="switchPreview()">
                    <template #icon>
                        <icon-edit v-if="preview"/>
                        <icon-lock v-else/>
                    </template>
                </a-button>
                <a-dropdown position="br">
                    <a-button>
                        <template #icon>
                            <icon-more/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="openHeExtra(useHomeEditorStore().id)" :disabled="preview">
                            <template #icon>
                                <icon-settings/>
                            </template>
                            设置
                        </a-doption>
                        <a-dsubmenu>
                            <template #icon>
                                <icon-export/>
                            </template>
                            导出
                            <template #content>
                                <a-doption @click="exportFile('md')" v-if="editorType === ArticleTypeEnum.MARKDOWN">
                                    markdown文件
                                </a-doption>
                                <a-doption @click="exportFile('md')" v-if="editorType === ArticleTypeEnum.RICH_TEXT">
                                    网页
                                </a-doption>
                                <a-doption @click="exportFile('pdf')">pdf文件</a-doption>
                                <a-doption @click="exportFile('img')">图片</a-doption>
                            </template>
                        </a-dsubmenu>
                    </template>
                </a-dropdown>
            </a-space>
        </a-button-group>
    </header>
</template>
<script lang="ts" setup>
import {nextTick, ref} from "vue";
import {openHeExtra} from "@/pages/home/layout/editor-content/components/HecExtra";
import {
    editorType, getContent,
    preview, saveContent,
    saveTitle, supportAutoSave,
    switchPreview,
    title,
    useHomeEditorStore
} from "@/store/components/HomeEditorStore";
import EchToc from "@/pages/home/layout/editor-content/components/EchToc.vue";
import {InputInstance} from "@arco-design/web-vue";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import MessageUtil from "@/utils/MessageUtil";

const switchCollapsed = useHomeEditorStore().switchCollapsed;
const titleEdit = ref(false);
const titleInput = ref<InputInstance>()

function clickTitleEdit() {
    titleEdit.value = true;
    nextTick(() => titleInput.value && titleInput.value.focus());
}

function clickTitleSave() {
    titleEdit.value = false;
    saveTitle();
}


function exportFile(type: string) {

}

function onSave() {
    saveContent(getContent.value())
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}

</script>
<style scoped>

</style>
