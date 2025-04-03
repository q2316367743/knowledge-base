<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import {useGlobalStore} from "@/store/GlobalStore";
import {useElementSize} from "@vueuse/core";
import {useArticleExportEvent, useArticleImportEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {createArticleExport} from "@/pages/note/layout/editor-content/components/ArticleExport";
import {download} from "@/utils/BrowserUtil";
import {readAsText} from "@/utils/file/FileUtil";
import {openArticleImport} from "@/pages/note/layout/editor-content/components/ArticleImport";
import {useArticleStore} from "@/store/db/ArticleStore";
import {codeEditorSetting} from "@/store/setting/CodeEditorSettingStore";

monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
})
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  allowNonTsExtensions: true,
})

const modelValue = defineModel({
  type: String,
  default: ''
})

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
  miniMap: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['change', 'editor-mounted']);

let editor: monaco.editor.IStandaloneCodeEditor | null = null
const codeEditBox = ref();


const size = useElementSize(codeEditBox);

watch(() => size.width.value, () => editor && editor.layout());
watch(() => size.height.value, () => editor && editor.layout());

const init = () => {
  editor = monaco.editor.create(codeEditBox.value, {
    value: modelValue.value,
    language: props.language,
    theme: useGlobalStore().isDark ? 'vs-dark' : 'vs',
    readOnly: props.readOnly,
    ...codeEditorSetting.value,
  });
  if (!props.miniMap) {
    editor.updateOptions({minimap: {enabled: false}});
  }

  // 监听值的变化
  editor.onDidChangeModelContent(() => {
    emit('change')
    if (editor) {
      modelValue.value = editor.getValue();
    }
  })

  emit('editor-mounted', editor);


  watch(modelValue, val => {
      if (editor) {
        const value = editor.getValue()
        if (val !== value) {
          editor.setValue(val)
        }
      }
    }
  )

  watch(() => props.language, value => {
    if (!editor) return;
    monaco.editor.setModelLanguage(editor.getModel()!, value)
  })

  watch(() => props.readOnly, value => {
    if (!editor) return;
    editor.updateOptions({readOnly: value})
  });

  watch(() => useGlobalStore().isDark, value => {
    if (!editor) return;
    editor.updateOptions({theme: value ? 'vs-dark' : 'vs'})
  });
  watch(codeEditorSetting, val => {
    if (!editor) return;
    editor.updateOptions(val)
  });
}

onMounted(() => init());
</script>
<style lang="less" scoped>
.codeEditBox {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
