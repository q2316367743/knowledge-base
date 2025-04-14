<template>
  <t-dropdown trigger="click" placement="bottom-left">
    <t-button variant="text" theme="primary" shape="square">
      <template #icon>
        <ellipsis-icon/>
      </template>
    </t-button>
    <t-dropdown-menu>
      <t-dropdown-item @click="openHeExtra(homeEditorId)" :disabled="preview">
        <template #prefix-icon>
          <setting-icon/>
        </template>
        设置
      </t-dropdown-item>
      <t-dropdown-item @click="onImport()">
        <template #prefix-icon>
          <file-import-icon/>
        </template>
        导入
      </t-dropdown-item>
      <t-dropdown-item @click="onExport()">
        <template #prefix-icon>
          <file-export-icon/>
        </template>
        导出
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>
<script lang="ts" setup>
import {
  homeEditorId,
  preview,
  useArticleExportEvent,
  useArticleImportEvent,
} from "@/store/components/HomeEditorStore";
import {openHeExtra} from "@/pages/note/layout/editor-content/components/HecExtra";
import {EllipsisIcon, FileExportIcon, FileImportIcon, SettingIcon} from "tdesign-icons-vue-next";

const onExport = () => useArticleExportEvent.emit(homeEditorId.value);
const onImport = () => useArticleImportEvent.emit(homeEditorId.value);
</script>
<style scoped lang="less">
</style>
