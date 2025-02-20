<template>
  <header class="editor-content-header">
    <div class="menu" :style="{padding: '4px'}">
      <a-button type="text" @click="switchCollapsed()">
        <template #icon>
          <icon-menu/>
        </template>
      </a-button>
    </div>
    <div class="tab" v-if="homeEditorArticles.length > 0">
      <a-tabs v-model:active-key="homeEditorId" hide-content editable @delete="close">
        <template #extra>
          <editor-content-extra/>
        </template>
        <a-tab-pane v-for="article in homeEditorArticles" :key="article.id" style="height: auto">
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
import {
  editorType, useArticlePreviewEvent, useHomeEditorStore, homeEditorId, homeEditorArticles
} from "@/store/components/HomeEditorStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {remove, rename} from "@/pages/note/components/he-context";
import EditorContentExtra from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtra.vue";


const switchCollapsed = useHomeEditorStore().switchCollapsed;


function close(e: any) {
  useHomeEditorStore().closeArticle(e);
}

function switchPreview(id: number) {
  useArticlePreviewEvent.emit(id);
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
