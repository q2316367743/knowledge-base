<template>
  <main class="edit-wang-editor kb-wang-editor" :class="{readonly: readOnly}">
    <div class="wang-editor-header" ref=editorHeaderDom></div>
    <div class="wang-editor-main" ref="editorContainerDom"></div>
  </main>
</template>
<script lang="ts" setup>
import {createEditor, createToolbar, IDomEditor, Toolbar, IToolbarConfig} from '@wangeditor/editor'
import {useArticleExportEvent} from "@/store";
import {onRichTextExport} from "@/editor/RichTextEditor/func";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import {useMountEventBus} from "@/hooks/MountEventBus";
import MessageUtil from "@/utils/modal/MessageUtil";

type InsertFnType = (url: string, alt: string, href: string) => void

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
  simple: Boolean
});
const emit = defineEmits(['change']);

const editorHeaderDom = ref<HTMLDivElement>();
const editorContainerDom = ref<HTMLDivElement>();

const editorRef = shallowRef<IDomEditor>()
const toolbarRef = shallowRef<Toolbar>()

watch(() => props.readOnly, value => {
  value ? editorRef.value?.disable() : editorRef.value?.enable();
}, {immediate: true});

function init() {
  if (!editorHeaderDom.value || !editorHeaderDom.value) {
    return;
  }
  const editor = createEditor({
    selector: editorContainerDom.value,
    html: content.value,
    mode: 'default',
    config: {
      onChange: (editor: IDomEditor) => {
        content.value = editor.getHtml();
        emit('change');
      },
      placeholder: '请输入内容...(支持部分markdown语法)',
      readOnly: props.readOnly,
      MENU_CONF: {
        uploadImage: {
          server: '/api/upload',
          // 自定义上传
          customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
            useAttachmentUpload.upload(file, file.name, 'image/png')
              .then(({name, url}) => insertFn(url, name, url))
              .catch(e => MessageUtil.error("上传失败", e));
          }
        },
        uploadVideo: {
          server: '/api/upload',
          customUpload(file: File, insertFn: InsertFnType) {
            //
            useAttachmentUpload.upload(file, file.name, file.type)
              .then(({name, url}) => insertFn(url, name, url))
              .catch(e => MessageUtil.error("上传失败", e));
          }
        }
      }

    }
  });
  const toolbarConfig: Partial<IToolbarConfig> = {}

  if (props.simple) {
    toolbarConfig.toolbarKeys = [
      {
        key: 'insert',
        title: '插入',
        menuKeys: ['insertLink', 'insertTable', 'insertImage', 'insertVideo']
      }, {
        key: 'upload',
        title: '上传',
        menuKeys: ['uploadImage', 'uploadVideo']
      },
      'fullScreen']
  }


  const toolbar = createToolbar({
    editor,
    selector: editorHeaderDom.value,
    config: toolbarConfig,
    mode: 'default', // or 'simple'
  });

  editorRef.value = editor;
  toolbarRef.value = toolbar;

}

useMountEventBus(useArticleExportEvent, onExport)

onMounted(() => {
  // 初始化
  init();
});

onBeforeUnmount(() => {
  toolbarRef.value?.destroy();
  editorRef.value?.destroy();
  // 移除键盘事件监听
})


function onExport(id: number) {
  onRichTextExport(id, props.articleId, editorRef.value)
}

</script>
<style lang="less">
.edit-wang-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--td-bg-color-container);
  display: flex;
  flex-direction: column;

  &.w-e-full-screen-container {
    z-index: 1000;
  }

  &.readonly {
    .wang-editor-header {
      display: none;
    }
  }

  .wang-editor-main {
    flex: 1;
    overflow: hidden;
  }

  // 搜索容器样式
  .search-container {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    background-color: var(--td-bg-color-container-hover);
    padding: 8px;
    border-radius: var(--td-radius-medium);
    box-shadow: var(--td-shadow-1);
    z-index: 100;

    .t-input {
      width: 200px;
      margin-right: 8px;
    }

    .search-buttons {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
