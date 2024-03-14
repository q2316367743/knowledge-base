<template>
    <header class="header">
        <div class="menu" :style="{padding: disabled ? '0px' : '4px'}">
            <a-button type="text" @click="switchCollapsed()">
                <template #icon>
                    <icon-menu/>
                </template>
            </a-button>
        </div>
        <div class="tab" :style="{left: disabled ? '32px' : '40px'}">
            <a-tabs v-model:active-key="activeKey" hide-content editable @delete="close">
                <template #extra>
                    <a-button-group type="text" :disabled="disabled">
                        <a-dropdown position="br">
                            <a-button>
                                <template #icon>
                                    <icon-more/>
                                </template>
                            </a-button>
                            <template #content>
                                <a-doption @click="switchPreview()" :disabled="editorType === ArticleTypeEnum.EXCEL">
                                    <template #icon>
                                        <icon-edit v-if="preview"/>
                                        <icon-lock v-else/>
                                    </template>
                                    {{ preview ? '编辑' : '预览' }}
                                </a-doption>
                                <a-doption @click="openHeExtra(useHomeEditorStore().id)" :disabled="preview">
                                    <template #icon>
                                        <icon-settings/>
                                    </template>
                                    设置
                                </a-doption>
                                <a-doption @click="onImport()">
                                    <template #icon>
                                        <icon-import/>
                                    </template>
                                    导入
                                </a-doption>
                                <a-doption @click="onExport()">
                                    <template #icon>
                                        <icon-export/>
                                    </template>
                                    导出
                                </a-doption>
                            </template>
                        </a-dropdown>
                    </a-button-group>
                </template>
                <a-tab-pane v-for="article in indexes" :key="article.id" :title="article.name"/>
            </a-tabs>
        </div>

    </header>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {openHeExtra} from "@/pages/home/layout/editor-content/components/HecExtra";
import {
    editorType,
    preview,
    switchPreview, useArticleExportEvent, useArticleImportEvent,
    useHomeEditorStore,
} from "@/store/components/HomeEditorStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

const activeKey = ref(useHomeEditorStore().id);

const switchCollapsed = useHomeEditorStore().switchCollapsed;

const indexes = computed(() => useHomeEditorStore().indexes);
const disabled = computed(() => useHomeEditorStore().indexes.length === 0);
const isNote = computed(() => editorType.value === ArticleTypeEnum.RICH_TEXT || editorType.value === ArticleTypeEnum.MARKDOWN);

watch(() => activeKey.value, value => useHomeEditorStore().setId(value));
watch(() => useHomeEditorStore().id, value => activeKey.value = value);

function close(e: any) {
    useHomeEditorStore().closeArticle(e);
}



function onExport() {
    // 触发保存
    useArticleExportEvent.emit(useHomeEditorStore().id);
}

function onImport() {
    useArticleImportEvent.emit(useHomeEditorStore().id);
}


</script>
<style scoped>

</style>
