<template>
  <div class="super-editor">
    <div ref="el"></div>
  </div>
</template>
<script lang="ts" setup>
import {fetchUrl} from "@/plugin/server";
import {debounce} from "radash";
import EditorJS, {OutputData} from "@editorjs/editorjs";
import Header from '@editorjs/header';
import LinkTool from "./tools/LinkTool";
import CodeTool from "./tools/Code";
import List from './tools/List';
import SimpleImage from './tools/SimpleImage';

const content = defineModel({
  type: Object as PropType<OutputData>,
  default: {
    blocks: []
  }
})

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
  articleId: Number
});

const el = ref();
const editor = shallowRef<EditorJS>()

const saveContent = debounce({delay: 300}, (data: OutputData) => {
  content.value = data;
})

onMounted(() => {
  editor.value = new EditorJS({
    holder: el.value,
    readOnly: props.readOnly,
    data: content.value,
    onChange: (api) => {
      api.saver.save().then(async (outputData: OutputData) => {
        saveContent(outputData);
      })
    },
    tools: {
      Header,
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: fetchUrl, // Your backend endpoint for url data fetching,
        }
      },
      list: {
        // @ts-ignore
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        },
      },
      SimpleImage, CodeTool
    }
  });
  watch(() => props.readOnly, val => {
    editor.value?.readOnly.toggle(val);
  })
});

onBeforeUnmount(() => editor.value?.destroy());

</script>
<style scoped lang="less">
.super-editor {
  padding: 0 8px;
  overflow: auto;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
