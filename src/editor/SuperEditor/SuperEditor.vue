<template>
  <div class="super-editor">
    <div ref="el"></div>
  </div>
</template>
<script lang="ts" setup>
import {fetchUrl} from "@/plugin/server";
import {debounce} from "radash";
import EditorJS, {OutputData} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from "@/editor/SuperEditor/tools/LinkTool";

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
      }
    }
  });
})

</script>
<style scoped lang="less">
.super-editor {
  padding: 0 8px;
}
</style>
