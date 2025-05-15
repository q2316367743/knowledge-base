<template>
  <main class="edit-wang-editor kb-wang-editor" :class="{readonly: readOnly}">
    <div class="wang-editor-header" ref=editorHeaderDom></div>
    <div class="wang-editor-main" ref="editorContainerDom"></div>
    <!-- 搜索区域 -->
    <div class="search-container" v-if="showSearch">
      <t-input
        v-model="searchText"
        placeholder="请输入搜索内容"
        :clearable="true"
        :autofocus="true"
        @enter="searchContent"
      />
      <div class="search-buttons">
        <t-button theme="primary" @click="searchContent">搜索</t-button>
        <t-button @click="closeSearch">关闭</t-button>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import {createEditor, createToolbar, IDomEditor, Toolbar, IToolbarConfig, SlateEditor, SlateTransforms} from '@wangeditor/editor'
import {useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {renderAttachmentUrl} from "@/plugin/server";
import {onRichTextExport} from "@/editor/RichTextEditor/func";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";

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

// 搜索相关
const showSearch = ref(false)
const searchText = ref('')

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
            useAttachmentUpload.upload(file, false, 'image/png')
              .then(key => {
                insertFn(key, key, '')
              })
          }
        },
        uploadVideo: {
          server: '/api/upload',
          customUpload(file: File, insertFn: InsertFnType) {
            //
            useAttachmentUpload.upload(file, false, file.type)
              .then(key => {
                insertFn(renderAttachmentUrl(key), key, '')
              })
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

useArticleExportEvent.on(onExport);

useEventListener(document, 'keydown', handleKeyDown);

onMounted(() => {
  // 初始化
  init();
});

// 处理键盘事件
function handleKeyDown(e: KeyboardEvent) {
  // 检测Ctrl+F
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault(); // 阻止浏览器默认的搜索行为
    showSearch.value = true;
    searchText.value = editorRef.value?.getSelectionText() || '';
  }
}

// 搜索内容
function searchContent() {
  if (!searchText.value || !editorRef.value) return;
  
  // 清除之前的搜索高亮
  clearSearchHighlight();
  
  // 获取编辑器文本内容
  const text = editorRef.value.getText();

  // 如果没有找到匹配内容，直接返回
  if (!text.includes(searchText.value)) return;
  
  // 使用wangeditor的API高亮匹配文本
  // 这里使用简单的文本匹配方式，实际项目中可能需要更复杂的匹配逻辑
  highlightMatchedText(searchText.value);
}

// 高亮匹配文本
function highlightMatchedText(keyword: string) {
  if (!editorRef.value) return;
  
  // 获取编辑器实例
  const editor = editorRef.value;
  
  // 获取编辑器中的所有文本节点
  const nodeEntries = SlateEditor.nodes(editor, {});
  const nodes = Array.from(nodeEntries);

  // 遍历所有文本节点，查找匹配的文本并添加高亮样式
  for (const [_node, path] of nodes) {
    // 获取节点的文本内容
    const textContent = SlateEditor.string(editor, path);

    // 如果文本内容包含关键词
    if (textContent.includes(keyword)) {
      // 计算关键词在文本中的位置
      const startIndex = textContent.indexOf(keyword);
      const endIndex = startIndex + keyword.length;
      
      // 选择匹配的文本范围
      const start = { path, offset: startIndex };
      const end = { path, offset: endIndex };
      
      // 创建一个范围选择
      const range = { anchor: start, focus: end };
      
      // 选择该范围并添加高亮样式
      SlateTransforms.select(editor, range);
      editor.addMark('backgroundColor', 'var(--td-warning-color-light)');
      editor.addMark('color', 'var(--td-warning-color-hover)');
    }
  }
}

// 清除搜索高亮
function clearSearchHighlight() {
  if (!editorRef.value) return;
  
  // 获取编辑器实例
  const editor = editorRef.value;
  
  // 选择整个编辑器内容
  SlateTransforms.select(editor, {
    anchor: SlateEditor.start(editor, []),
    focus: SlateEditor.end(editor, [])
  });
  
  // 移除所有高亮标记
  editor.removeMark('backgroundColor');
  editor.removeMark('color');
  
  // 取消选择
  SlateTransforms.deselect(editor);
}

// 关闭搜索
function closeSearch() {
  showSearch.value = false;
  searchText.value = '';
  clearSearchHighlight();
}

onBeforeUnmount(() => {
  toolbarRef.value?.destroy();
  editorRef.value?.destroy();
  
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeyDown);
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
