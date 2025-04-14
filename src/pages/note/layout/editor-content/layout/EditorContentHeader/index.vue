<template>
  <header class="editor-content-header">
    <div :style="{padding: '4px'}" :class="{menu: true, border: homeEditorArticles.length > 0}">
      <t-button variant="text" theme="primary" shape="square" @click="switchCollapsed()">
        <template #icon>
          <menu-fold-icon v-if="collapsed"/>
          <menu-unfold-icon v-else/>
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
              <close-icon color="red" class="ml-8px editor-content-tab-close"
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
import {CloseIcon, LockOnIcon, MenuFoldIcon, MenuUnfoldIcon} from "tdesign-icons-vue-next";
import {
  editorType, useArticlePreviewEvent, useHomeEditorStore, homeEditorId, homeEditorArticles
} from "@/store/components/HomeEditorStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {remove, rename} from "@/pages/note/components/he-context";
import {useGlobalStore} from "@/store/GlobalStore";
import {ArticleIndex} from "@/entity/article";
import {openNotePreview} from "@/widget/NotePreview";
import EditorContentExtra from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtra.vue";

const {switchCollapsed, closeArticle, closeOther, closeAll} = useHomeEditorStore();

const collapsed = computed(() => useHomeEditorStore().collapsed);

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
    theme: useGlobalStore().isDark ? "default dark" : "default",
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
      label: '小窗打开',
      onClick: () => openNotePreview(article.id)
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
      border-bottom: 1px solid var(--td-component-stroke);
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

    .editor-content-tab-close {
      transition: all 0.3s;

      &:hover {
        background-color: var(--td-bg-color-component-hover);
      }
    }
  }
}
</style>
