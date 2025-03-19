<template>
  <div class="super-editor">
    <div ref="el" class="super-editor__wrapper"></div>
  </div>
</template>
<script lang="ts" setup>
import {fetchUrl} from "@/plugin/server";
import {debounce} from "radash";
import EditorJS, {OutputData} from "@editorjs/editorjs";
// 内部工具
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
// 块工具
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import LinkTool from "./tools/LinkTool";
import CodeTool from "./tools/Code";
import List from './tools/List';
import SimpleImage from './tools/SimpleImage';
import AlertTool from './tools/AlertTool';
import MindMapTool from './tools/MindMapTool';
import LogicFlowTool from './tools/LogicFlowTool';
import KanbanTool from './tools/KanbanTool';
import EncryptText from './tools/EncryptTextTool';


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
const editor = shallowRef<EditorJS>();

const saveContent = debounce({delay: 300}, (data: OutputData) => {
  content.value = data;
})

onMounted(() => {
  editor.value = new EditorJS({
    holder: el.value,
    readOnly: props.readOnly,
    data: content.value,
    autofocus: true,
    i18n: {
      messages: {
        toolNames: {
          'Text': '段落',
          'Heading': '标题',
          'Table': '表格',
          'Convert to': '转换为',
          'Bold': '加粗',
          'Link': '链接',
          'Italic': '斜体',
          'Underline': '下划线',
          'Marker': '标记',
          'InlineCode': '内联代码',
          'Delimiter': '分割线'
        },
        tools: {
          'Table': {
            'With headings': '带表头',
            'Without headings': '不带表头',
            'Collapse': '收起',
            'Stretch': '展开',
            'Add column to left': '在左侧添加列',
            'Add column to right': '在右侧添加列',
            'Delete column': '删除列',
            'Add row above': '添加上方行',
            'Add row below': '添加下方行',
            'Delete row': '删除行',
            'Heading': '表头'
          },
          'alert': {
            'Default': '默认',
            'Primary': '主要',
            'Success': '成功',
            'Warning': '警告',
            'Danger': '危险',
            'Left': '左对齐',
            'Center': '居中对齐',
            'Right': '右对齐'
          }
        },
        blockTunes: {
          "delete": {
            "Delete": "删除",
            "Click to delete": '再次点击删除'
          },
          "moveUp": {
            "Move up": "上移"
          },
          "moveDown": {
            "Move down": "下移"
          }
        },
      }
    },
    onChange: (api) => {
      api.saver.save().then(async (outputData: OutputData) => {
        saveContent(outputData);
      })
    },
    tools: {
      Header, SimpleImage,
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: fetchUrl, // Your backend endpoint for url data fetching,
        }
      },
      alert: {
        class: AlertTool as any,
        inlineToolbar: true,
      },
      list: {
        class: List as any,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        },
      }, Delimiter, Table, CodeTool, MindMapTool, LogicFlowTool, KanbanTool, EncryptText,

      // 内联工具
      Underline: {
        class: Underline,
        shortcut: 'CMD+SHIFT+U',
      },
      Marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C',
      },
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
  overflow: auto;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
