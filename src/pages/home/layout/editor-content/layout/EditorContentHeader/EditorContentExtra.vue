<template>
  <div>
    <editor-content-extra-run />
    <editor-content-extra-ai />
    <a-dropdown position="br">
      <a-button type="text">
        <template #icon>
          <icon-more/>
        </template>
      </a-button>
      <template #content>
        <a-doption @click="switchPreview()" :disabled="editorType === ArticleTypeEnum.EXCEL">
          <template #icon>
            <icon-lock/>
          </template>
          编辑/预览
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
  </div>
</template>
<script lang="ts" setup>
import {
  editorType,
  preview,
  useArticleExportEvent,
  useArticleImportEvent, useArticlePreviewEvent,
  useHomeEditorStore
} from "@/store/components/HomeEditorStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {openHeExtra} from "@/pages/home/layout/editor-content/components/HecExtra";
import EditorContentExtraAi from "@/pages/home/layout/editor-content/layout/EditorContentHeader/EditorContentExtraAi.vue";
import EditorContentExtraRun
  from "@/pages/home/layout/editor-content/layout/EditorContentHeader/EditorContentExtraRun.vue";

const onExport = () => useArticleExportEvent.emit(useHomeEditorStore().id);
const onImport = () => useArticleImportEvent.emit(useHomeEditorStore().id);
const switchPreview = (id?: number) => useArticlePreviewEvent.emit(id || useHomeEditorStore().id);


</script>
<style scoped lang="less">

</style>
