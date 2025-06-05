<template>
  <div class="not-note w-full h-full">
    <div class="not-note-container flex items-center justify-center">
      <div class="module-item mr-16" @click="addArticleModal()">
        <div class="module-item-icon">
          <sticky-note-icon size="36px"/>
        </div>
        <div class="module-item-name">
          新建笔记
        </div>
      </div>
      <t-dropdown :options="options" trigger="click">
        <div class="module-item">
          <div class="module-item-icon">
            <file-import-icon size="36px"/>
          </div>
          <div class="module-item-name">
            笔记导入
          </div>
        </div>
      </t-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {FileImportIcon, StickyNoteIcon} from "tdesign-icons-vue-next";
import {addArticleModal} from "@/pages/note/components/he-context";
import {openArticleImport} from "@/modules/NoteImport";
import {showArticleImportModal} from "@/pages/note/components/ArticleImportModal";

const options = [{
  content: '常规导入',
  onClick: () => showArticleImportModal(0)
}, {
  content: '链接导入',
  onClick: () => openArticleImport()
}]

</script>
<style scoped lang="less">
.not-note {
  display: grid;
  place-items: center;
  background-color: var(--td-bg-color-container);

  .not-note-container {
    max-width: 600px;
    width: 100%;

    .module-item {
      padding: 16px;
      cursor: pointer;
      margin-right: 16px;
      user-select: none;

      &:last-child {
        margin-right: 0;
      }

      .module-item-icon {
        padding: 16px;
        border-radius: 50%;
        color: var(--td-brand-color);
        background-color: var(--td-bg-color-component);
      }

      .module-item-name {
        text-align: center;
        margin-top: 16px;
        font-size: var(--td-font-title-large);
      }
    }
  }
}
</style>
