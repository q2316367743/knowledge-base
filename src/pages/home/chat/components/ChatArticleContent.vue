<template>
  <div class="chat-article-content">
    <div ref="el"/>
  </div>
</template>
<script lang="ts" setup>
import Cherry from 'cherry-markdown';
import {useGlobalStore} from "@/store/GlobalStore";

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
      global: {
        // 开启流式模式 （默认 true）
        flowSessionContext: true,
        flowSessionCursor: 'default',
      },
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
.chat-article-content {
  :deep(.cherry) {
    box-shadow: none;

    .cherry-previewer {
      border: none;
      padding: 0;
      background-color: var(--color-bg-1);
    }
  }
}
</style>
