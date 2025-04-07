<template>
  <div class="feedback-md-editor">
    <div ref="el"/>
  </div>
</template>
<script lang="ts" setup>
import Cherry from 'cherry-markdown';
import {useGlobalStore} from "@/store/GlobalStore";
import {fileUpload} from "@/nested/feedback/apis/feedback/file";

const content = defineModel({
  type: String,
  default: () => ''
});
//每次交流都是灵感的开始...
const el = ref();
const current = shallowRef<Cherry>();

onMounted(() => {
  const {isDark} = useGlobalStore();
  current.value = new Cherry({
    el: el.value,
    value: content.value,
    editor: {
      defaultModel: 'editOnly',
    },
    toolbars: {
      toolbar: []
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
    themeSettings: {
      toolbarTheme: isDark ? 'dark' : 'light',
      codeBlockTheme: isDark ? 'material-ocean' : 'default',
      mainTheme: isDark ? 'dark' : 'light',
      inlineCodeTheme: isDark ? 'black' : 'red',
      themeList: []
    },
    event: {
      afterChange(text) {
        content.value = text;
      },
    },
    fileUpload(file, cb) {
      fileUpload(file).then(cb);
    }
  });
  current.value.setTheme(useGlobalStore().isDark ? 'dark' : 'default')
});


onUnmounted(() => {
  current.value?.destroy();
})
</script>
<style scoped lang="less">
.feedback-md-editor {
  height: calc(100vh - 48px);
  width: 100%;

  :deep(.cherry) {
    box-shadow: none;
    background-color: transparent;

    .cherry-previewer {
      border: none;
      padding: 0;
      background-color: var(--td-bg-color-container);
    }

    .cherry-toolbar {
      display: none;
    }

    .CodeMirror-lines {
      padding: 8px;
    }
  }
}
</style>