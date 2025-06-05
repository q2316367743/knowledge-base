<template>
  <div class="monaco-editor">
    <MonacoEditorCore v-model="content" :language :read-only="readOnly" :article-id="articleId" :mini-map="miniMap"
                      @change="emit('change')" @editor-mounted="emit('editor-mounted')"/>
  </div>
</template>
<script lang="ts" setup>
import MonacoEditorCore from "@/editor/MonacoEditor/MonacoEditorCore.vue";
import {useArticleExportEvent, useArticleImportEvent, useArticleStore, useHomeEditorStore} from "@/store";
import {createArticleExport} from "@/pages/note/layout/editor-content/components/ArticleExport";
import {openArticleImport} from "@/pages/note/layout/editor-content/components/ArticleImport";
import {download} from "@/utils/BrowserUtil";
import {readAsText} from "@/utils/file/FileUtil";
import {useMountEventBus} from "@/hooks/MountEventBus";

const content = defineModel({
  type: String,
  default: ''
});
const props = defineProps({
  language: {
    type: String as PropType<string>,
    default: 'javascript',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  articleId: Number,
  fileName: String,
  height: {
    type: String,
    default: '100%'
  },
  miniMap: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['change', 'editor-mounted']);

useMountEventBus(useArticleExportEvent, onExport)
useMountEventBus(useArticleImportEvent, onImport)


function onExport(id: number) {
  if (props.articleId === id) {
    createArticleExport(id, [{
      key: 1,
      name: '代码文件',
      desc: '默认导出',
      extname: ''
    }]).then(res => {
      const {type, title} = res;
      if (type === 1) {
        download(content.value, title, 'text');
      }
    });
  }
}

function onImport(id: number) {
  if (props.articleId === id) {
    openArticleImport([]).then(file => readAsText(file).then(text => {
      content.value = text;
      useArticleStore().updateIndex(id, {
        name: file.name
      }).then(res => useHomeEditorStore().update(id, res));
    }));
  }
}
</script>
<style scoped lang="less">
.monaco-editor {
  position: relative;
  width: 100%;
  height: v-bind(height);
}
</style>
