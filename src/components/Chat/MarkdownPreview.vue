<template>
  <div class="markdown-preview">
    <div ref="el"/>
  </div>
</template>
<script lang="ts" setup>
import Cherry from 'cherry-markdown';
import {useGlobalStore} from "@/store/GlobalStore";
import {onClickPreview} from "@/editor/MarkdownEditor/common/event";

const props = defineProps({
  value: {
    type: String,
    default: '',
  }
});

const el = ref();
const current = shallowRef<Cherry>();

onMounted(() => {
  current.value = new Cherry({
    el: el.value,
    value: props.value,
    editor: {
      height: 'auto',
      defaultModel: 'previewOnly',
    },
    engine: {
      syntax: {
        codeBlock: {
          selfClosing: false,
        },
        header: {
          anchorStyle: 'none',
        },
        table: {
          selfClosing: false,
        },
        fontEmphasis: {
          selfClosing: false,
        }
      }
    },
    previewer: {
      enablePreviewerBubble: false,
    },
    isPreviewOnly: true,
    callback: {
      onClickPreview
    },
    toolbars: {
      toc: false
    }
  });
  current.value.setTheme(useGlobalStore().isDark ? 'dark' : 'default')
});

watch(() => props.value, (newValue) => {
  if (current.value) {
    current.value.setMarkdown(newValue);
  }
})

onUnmounted(() => {
  current.value?.destroy();
})
</script>
<style scoped lang="less">
.markdown-preview {
  :deep(.cherry) {
    box-shadow: none;
    background-color: transparent;

    .cherry-previewer {
      border: none;
      background-color: transparent !important;
      color: var(--td-text-color-primary);
    }

    img {
      max-width: calc(100% - 16px);
      margin: 8px;
    }
  }
}
</style>
