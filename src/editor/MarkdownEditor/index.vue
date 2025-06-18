<template>
  <div class="markdown-editor" ref="markdown-editor">
    <div class="markdown-editor-wrap" :id="id"></div>
  </div>
</template>
<script lang="ts" setup>
import Cherry from "cherry-markdown";
import {editorProps, MarkdownEditorPropsType} from "@/editor/MarkdownEditor/CherryMarkdownOption";
import {
  useArticleExportEvent, useArticleImportEvent, useArticleStore, useBaseSettingStore, useGlobalStore, useHomeEditorStore
} from "@/store";

import MessageUtil from "@/utils/modal/MessageUtil";
import {extname, parseFileName, readAsText} from "@/utils/file/FileUtil";
import {htmlToMarkdown} from "@/utils/file/ConvertUtil";

import Constant from "@/global/Constant";

import {openMarkdownExport} from "./common/MarkdownExport";

import {openArticleImport} from "@/pages/note/layout/editor-content/components/ArticleImport";

import {buildConfig} from "@/editor/MarkdownEditor/common/build-config";
import {useMountEventBus} from "@/hooks/MountEventBus";

const props = defineProps(editorProps);
const emits = defineEmits(['update:modelValue', 'sendToChat']);

const instance = shallowRef<Cherry>();
const el = useTemplateRef<HTMLDivElement>('markdown-editor');
const id = 'markdown-editor-' + props.articleId;
const size = useElementSize(el);

useMountEventBus(useArticleExportEvent, onExport);
useMountEventBus(useArticleImportEvent, onImport);

onMounted(() => {
  if (!el.value) return MessageUtil.error("markdown笔记挂载元素不存在");
  buildConfig(
    props,
    el.value,
    instance,
    e => emits('update:modelValue', e),
    e => emits('sendToChat', e)
  ).then(config => {
    instance.value = new Cherry(config);
    handleTheme();
  }).catch(e => MessageUtil.error("编辑器初始化失败", e))
});

watch(() => props.preview, handleToolbar);
watch(() => size.width.value, value => {
  if (instance.value) {
    if (useBaseSettingStore().mdEditorAutoMode && !props.preview) {
      instance.value.switchModel(value > Constant.autoCollapsedWidth ? 'edit&preview' : 'editOnly');
    }
  }
});
watch(() => useGlobalStore().isDark, value => {
  if (instance.value) {
    instance.value.setTheme(value ? 'dark' : 'default')
  }
})

function handleToolbar(value: boolean) {
  instance.value && instance.value.switchModel(value ? 'previewOnly' : useBaseSettingStore().defaultModel);
}

function handleTheme() {
  if (!instance.value) {
    return;
  }
  instance.value.setTheme(useGlobalStore().isDark ? 'dark' : 'default')
}


function onExport(id: number) {
  if (props.articleId === id && instance.value) {
    openMarkdownExport(id, instance.value)
  }
}

function setValue(text: string, name: string, id: number) {
  instance.value && instance.value.setValue(text);
  const fileName = parseFileName(name);
  useArticleStore().updateIndex(id, {
    name: fileName
  }).then(res => useHomeEditorStore().update(id, res));
}

function onImport(id: number) {
  if (props.articleId === id && instance.value) {
    openArticleImport(['.md', '.markdown'])
      .then(file => {
        const ext = extname(file.name);
        if (ext === 'md' || ext === 'markdown' || ext === 'html') {
          readAsText(file).then(text => {
            if (ext === 'html') {
              text = htmlToMarkdown(text);
            } else if (ext !== 'md' && ext !== 'markdown') {
              MessageUtil.warning("文件类型不支持");
              return;
            }
            setValue(text, file.name, id);
          })
        }
      });
  }

}
</script>
<style lang="less">
.markdown-editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .markdown-editor-wrap {
    position: relative;
  }

  .cherry {
    background-color: transparent;
    color: var(--td-text-color-primary);
    .cherry-editor {
      .CodeMirror {
        background-color: var(--kb-bg-color-6) !important;
      }
    }

    .cherry-previewer {
      background-color: var(--kb-bg-color-3) !important;

      &.cherry-preview--full {
        border: none;
      }

      a {
        color: var(--td-text-color-link);
      }

      image, img {
        max-width: 100%;
      }
    }
  }
}

</style>
