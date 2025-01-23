<template>
  <header class="editor-content-header">
    <div class="menu" :style="{padding: '4px'}">
      <a-button type="text" @click="switchCollapsed()">
        <template #icon>
          <icon-menu/>
        </template>
      </a-button>
    </div>
    <div class="tab" v-if="indexes.length > 0">
      <a-tabs v-model:active-key="activeKey" hide-content editable @delete="close">
        <template #extra>
          <a-button-group type="text" :disabled="disabled">
            <a-tooltip content="AI助理" position="bottom" v-if="useChatSettingStore().enable">
              <a-button @click="switchRobot()">
                <template #icon>
                  <icon-robot/>
                </template>
              </a-button>
            </a-tooltip>
            <a-dropdown position="br">
              <a-button>
                <template #icon>
                  <icon-more/>
                </template>
              </a-button>
              <template #content>
                <a-doption @click="switchPreview()" :disabled="editorType === ArticleTypeEnum.EXCEL">
                  <template #icon>
                    <icon-lock/>
                  </template>
                  编辑/预览
                </a-doption>
                <a-doption @click="openHeExtra(useHomeEditorStore().id)" :disabled="preview">
                  <template #icon>
                    <icon-settings/>
                  </template>
                  设置
                </a-doption>
                <a-doption @click="onImport()">
                  <template #icon>
                    <icon-import/>
                  </template>
                  导入
                </a-doption>
                <a-doption @click="onExport()">
                  <template #icon>
                    <icon-export/>
                  </template>
                  导出
                </a-doption>
              </template>
            </a-dropdown>
          </a-button-group>
        </template>
        <a-tab-pane v-for="article in indexes" :key="article.id" style="height: auto">
          <template #title>
            <a-dropdown position="bottom" trigger="contextMenu" :popup-max-height="false">
              <div>
                <icon-lock v-if="article.preview" style="margin-right: 4px"/>
                <span>{{ article.name }}</span>
              </div>
              <template #content>
                <a-doption @click="close(article.id)">
                  关闭
                </a-doption>
                <a-doption @click="useHomeEditorStore().closeOther(article.id)">
                  关闭其他标签
                </a-doption>
                <a-doption @click="useHomeEditorStore().closeAll()">
                  关闭全部标签
                </a-doption>
                <a-dgroup title="更多">
                  <a-doption @click="rename(article.id, article.name, true)">
                    重命名
                  </a-doption>
                  <a-doption @click="remove(article.id, article.name, true)">
                    删除
                  </a-doption>
                  <a-doption @click="switchPreview(article.id)" :disabled="editorType === ArticleTypeEnum.EXCEL">
                    {{ article.preview ? '编辑' : '预览' }}
                  </a-doption>
                </a-dgroup>
              </template>
            </a-dropdown>
          </template>
        </a-tab-pane>
      </a-tabs>
    </div>
  </header>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {openHeExtra} from "@/pages/home/layout/editor-content/components/HecExtra";
import {
  editorType, useUpdateRobotEvent, preview, useArticleExportEvent, useArticleImportEvent,
  useArticlePreviewEvent, useHomeEditorStore
} from "@/store/components/HomeEditorStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {remove, rename} from "@/pages/home/components/he-context";

const activeKey = ref(useHomeEditorStore().id);

const switchCollapsed = useHomeEditorStore().switchCollapsed;

const indexes = computed(() => useHomeEditorStore().indexes);
const disabled = computed(() => useHomeEditorStore().indexes.length === 0);

watch(() => activeKey.value, value => useHomeEditorStore().setId(value));
watch(() => useHomeEditorStore().id, value => activeKey.value = value);

function close(e: any) {
  useHomeEditorStore().closeArticle(e);
}


function onExport() {
  // 触发保存
  useArticleExportEvent.emit(useHomeEditorStore().id);
}

function onImport() {
  useArticleImportEvent.emit(useHomeEditorStore().id);
}

function switchRobot() {
  useUpdateRobotEvent.emit(useHomeEditorStore().id);
}

function switchPreview(id?: number) {
  useArticlePreviewEvent.emit(id || useHomeEditorStore().id);
}

</script>
<style scoped lang="less">
.editor-content-header {
  height: 40px;
  align-items: center;
  border-bottom: 1px solid var(--color-border-2);

  .menu {
    width: 32px;
    height: 31px;
    overflow-y: hidden;
  }

  .tab {
    position: absolute;
    top: 0;
    left: 40px;
    right: 4px;
    height: 40px;

    :deep(.arco-tabs-nav::before) {
      display: none;
    }
  }
}
</style>
