<template>
  <div class="h-32px p-2px">
    <editor-content-extra-run/>
    <editor-content-extra-ai/>
    <t-dropdown trigger="click" placement="bottom-left">
      <t-button variant="text" theme="primary" shape="square">
        <template #icon>
          <icon-more/>
        </template>
      </t-button>
      <t-dropdown-menu>
        <t-dropdown-item @click="switchPreview()" :disabled="editorType === ArticleTypeEnum.EXCEL">
          <template #prefix-icon>
            <edit2-icon v-if="preview"/>
            <lock-on-icon v-else/>
          </template>
          {{ preview ? '编辑' : '预览' }}
        </t-dropdown-item>
        <t-dropdown-item @click="openHeExtra(homeEditorId)" :disabled="preview">
          <template #prefix-icon>
            <icon-settings/>
          </template>
          设置
        </t-dropdown-item>
        <t-dropdown-item @click="onImport()">
          <template #prefix-icon>
            <icon-import/>
          </template>
          导入
        </t-dropdown-item>
        <t-dropdown-item @click="onExport()">
          <template #prefix-icon>
            <icon-export/>
          </template>
          导出
        </t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {
  editorType, homeEditorId,
  preview,
  useArticleExportEvent,
  useArticleImportEvent, useArticlePreviewEvent,
} from "@/store/components/HomeEditorStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {openHeExtra} from "@/pages/note/layout/editor-content/components/HecExtra";
import EditorContentExtraAi
  from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtraAi.vue";
import EditorContentExtraRun
  from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtraRun.vue";
import {Edit2Icon, LockOnIcon} from "tdesign-icons-vue-next";

const onExport = () => useArticleExportEvent.emit(homeEditorId.value);
const onImport = () => useArticleImportEvent.emit(homeEditorId.value);
const switchPreview = (id?: number) => useArticlePreviewEvent.emit(id || homeEditorId.value);


</script>
<style scoped lang="less">
</style>
