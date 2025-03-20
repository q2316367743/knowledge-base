<template>
  <header class="editor-content-header">
    <div :style="{padding: '4px'}" :class="{menu: true, border: homeEditorArticles.length > 0}">
      <t-button variant="text" theme="primary" shape="square" @click="switchCollapsed()">
        <template #icon>
          <icon-menu/>
        </template>
      </t-button>
    </div>
    <div class="tab" v-if="homeEditorArticles.length > 0">
      <t-tabs v-model="homeEditorId" size="medium">
        <template #action>
          <editor-content-extra/>
        </template>
        <t-tab-panel v-for="article in homeEditorArticles" :value="article.id" style="height: auto">
          <template #label>
            <div class="items-center" @contextmenu="onContextmenu($event, article)">
              <lock-on-icon v-if="article.preview" class="mr-4px"/>
              <span>{{ article.name }}</span>
              <close-icon color="red" class="ml-8px hover:bg-#f2f2f2" style="transition:all 0.3s"
                          @click="close($event, article.id)"/>
            </div>
          </template>
        </t-tab-panel>
      </t-tabs>
    </div>
  </header>
</template>
<script lang="ts" setup>
import ContextMenu from "@imengyu/vue3-context-menu";
import {
  editorType, useArticlePreviewEvent, useHomeEditorStore, homeEditorId, homeEditorArticles
} from "@/store/components/HomeEditorStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {remove, rename} from "@/pages/note/components/he-context";
import EditorContentExtra from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtra.vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {ArticleIndex} from "@/entity/article";
import {CloseIcon, LockOnIcon} from "tdesign-icons-vue-next";

const {switchCollapsed, closeArticle, closeOther, closeAll} = useHomeEditorStore();

function close(ev: { e: Event }, id: any) {
  ev.e.stopPropagation();
  ev.e.preventDefault();
  closeArticle(id);
}

function switchPreview(id: number) {
  useArticlePreviewEvent.emit(id);
}

function onContextmenu(e: MouseEvent, article: ArticleIndex) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? "default-dark" : "default",
    zIndex: 200,
    items: [{
      label: '关闭',
      onClick: () => close({e}, article.id)
    }, {
      label: '关闭其他标签',
      onClick: () => closeOther(article.id)
    }, {
      label: '关闭全部标签',
      onClick: () => closeAll()
    }, {
      divided: 'self'
    }, {
      label: '重命名',
      onClick: () => rename(article.id, article.name, true)
    }, {
      label: '删除',
      onClick: () => remove(article.id, article.name, true)
    }, {
      label: article.preview ? '编辑' : '预览',
      onClick: () => switchPreview(article.id),
      disabled: editorType.value === ArticleTypeEnum.EXCEL
    }]
  });
}

</script>
<style scoped lang="less">
.editor-content-header {
  height: 40px;
  align-items: center;

  .menu {
    width: 32px;
    height: 31px;
    overflow-y: hidden;
    border-bottom: 1px solid transparent;

    &.border {
      border-bottom: 1px solid var(--td-border-level-1-color);
    }
  }

  .tab {
    position: absolute;
    top: 0;
    left: 40px;
    right: 4px;
    height: 40px;

    :deep(.t-tabs__nav-item) {
      height: 40px !important;
    }

    :deep(.t-tabs__operations) {
      border: none;
    }
  }
}
</style>
