<template>
  <main class="kb-rich-editor editor-common" :class="{readonly: readOnly}">
    <div class="kb-rich-editor-main" ref="editorContainerDom">
      <div class="aie-container">
        <div class="aie-container-header" v-show="!readOnly"></div>
        <div class="aie-container-main"></div>
        <div class="aie-container-footer" v-show="!readOnly"></div>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import {AiEditor, Uploader} from "aieditor";
import {useArticleExportEvent, useArticleStore, useGlobalStore} from "@/store";
import {onRichTextExport} from "@/editor/RichTextEditor/func";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import {useMountEventBus} from "@/hooks/MountEventBus";
import MessageUtil from "@/utils/modal/MessageUtil";
import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";


const content = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
  articleId: Number,
  simple: Boolean,
  autoFocus: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['change']);

const editorContainerDom = ref<HTMLDivElement>();
const editorRef = shallowRef<AiEditor>()


watch(() => props.readOnly, value => editorRef.value?.setEditable(!value), {immediate: true});
watch(() => useGlobalStore().isDark, value => editorRef.value?.changeTheme(value ? 'dark' : 'light'));

useMountEventBus(useArticleExportEvent, onExport);

const fileUploader: Uploader = async (file) => {
  const {url, name} = await useAttachmentUpload.upload(file, file.name, file.type);
  return {
    "errorCode": 0,
    "data": {
      "src": url,
      "alt": name,
      "align": "center",
      "width": "100%",
      "height": "auto",
      "loading": true,
      "data-src": url
    }
  }
}

onMounted(() => {
  if (!editorContainerDom.value) return MessageUtil.error("editorContainerDom不存在");
  const {isDark} = useGlobalStore();
  // 初始化
  editorRef.value = new AiEditor({
    element: editorContainerDom.value,
    placeholder: "点击输入内容，支持markdown语法",
    content: content.value,
    editable: !props.readOnly,
    draggable: false,
    theme: isDark ? 'dark' : 'light',
    toolbarKeys: props.simple ? ["font-family", "font-size",
        "|", "highlight", "font-color",
        "|", "link", "subscript", "superscript", "todo", "emoji",
        "|", "align", "line-height",
        "|", "image", "video", "table"
      ] :
      ["undo", "redo", "brush", "eraser",
        "|", "heading", "font-family", "font-size",
        "|", "bold", "italic", "underline", "strike", "link", "code", "subscript", "superscript", "hr", "todo", "emoji",
        "|", "highlight", "font-color",
        "|", "align", "line-height",
        "|", "bullet-list", "ordered-list", "indent-decrease", "indent-increase", "break",
        "|", "image", "video", "attachment", "quote", "container", "code-block", "table",
      ],
    textSelectionBubbleMenu: {
      enable: true,
      items: ["Bold", "Italic", "Underline", "Strike", "code", "comment"],
    },
    onChange: (editor) => {
      content.value = editor.getHtml();
    },
    image: {
      allowBase64: true,
      defaultSize: 350,
      uploader: fileUploader,
      bubbleMenuItems: ["AlignLeft", "AlignCenter", "AlignRight", "delete"]
    },
    video: {
      uploader: fileUploader
    },
    attachment: {
      uploader: async (file) => {
        const {url, name} = await useAttachmentUpload.upload(file, file.name, file.type);
        return {
          "errorCode": 0,
          "data": {
            href: url,
            fileName: name
          }
        }
      }
    },
    onMentionQuery: async (query) => {
      const {articles} = useArticleStore()
      return articles.filter(e => e.name.includes(query)).map(e => ({
        id: e.id,
        label: e.name
      }));
    }
  })
});

onBeforeUnmount(() => {
  // 移除键盘事件监听
  editorRef.value?.destroy();
})

function onExport(id: number) {
  onRichTextExport(id, props.articleId, editorRef.value)
}

useEventListener(editorContainerDom, 'click', (e) => {
  const target = e.target as HTMLElement;
  if (!target) return;
  if (target.tagName === 'SPAN' && target.dataset.type === 'mention') {
    toArticleByRelation(Number(target.dataset.id));
  }
})

</script>
<style lang="less">
.kb-rich-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .kb-rich-editor-main {
    width: calc(100% - 2px);
    height: calc(100% - 2px);
  }

  .aie-container {
    border: none !important;
  }

  .aie-container-main {
    flex-grow: 1;
    overflow: auto;
  }

  .aie-container-footer {
    span {
      color: var(--td-text-color-primary) !important;
    }
  }


}
</style>
