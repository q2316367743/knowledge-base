<template>
  <a-dropdown trigger="click" :popup-max-height="false">
    <slot></slot>
    <template #content>
      <a-dsubmenu v-if="folder">
        <template #icon>
          <icon-plus/>
        </template>
        新增笔记
        <template #content>
          <a-doption v-for="articleType in articleTypes" :key="articleType.key"
                     @click="addArticle(id, articleType.key)">
            <template #icon>
              <component :is="articleType.icon"/>
            </template>
            {{ articleType.name }}
          </a-doption>
        </template>
      </a-dsubmenu>
      <a-doption v-if="folder" @click="addFolder(id)">
        <template #icon>
          <icon-folder-add/>
        </template>
        新建文件夹
      </a-doption>
      <a-dsubmenu v-if="folder && more">
        <template #icon>
          <icon-apps/>
        </template>
        更多操作
        <template #content>
          <a-doption @click="$emit('multi',id)">
            <template #icon>
              <icon-check-square/>
            </template>
            多选
          </a-doption>
          <a-doption @click="rename(id, name, !folder)">
            <template #icon>
              <icon-edit/>
            </template>
            重命名
          </a-doption>
          <a-doption @click="remove(id, name, !folder)"
                     style="color: red;">
            <template #icon>
              <icon-delete/>
            </template>
            删除
          </a-doption>
          <a-doption @click="moveTo(id, name, !folder)">
            <template #icon>
              <icon-to-right/>
            </template>
            移动到
          </a-doption>
        </template>
      </a-dsubmenu>
      <a-doption v-if="!folder"
                 @click="rename(id, name, !folder)">
        <template #icon>
          <icon-edit/>
        </template>
        重命名
      </a-doption>
      <a-dsubmenu v-if="!folder">
        <template #icon>
          <icon-apps/>
        </template>
        更多操作
        <template #content>
          <a-doption @click="rename(id, name, !folder)">
            <template #icon>
              <icon-bg-colors/>
            </template>
            设置颜色
          </a-doption>
          <a-doption @click="remove(id, name, !folder)"
                     style="color: red;">
            <template #icon>
              <icon-delete/>
            </template>
            删除
          </a-doption>
          <a-doption @click="moveTo(id, name, !folder)">
            <template #icon>
              <icon-to-right/>
            </template>
            移动到
          </a-doption>
          <a-doption @click="$emit('multi',id)">
            <template #icon>
              <icon-check-square/>
            </template>
            多选
          </a-doption>
        </template>
      </a-dsubmenu>
      <a-dsubmenu v-if="folder">
        <template #icon>
          <icon-import/>
        </template>
        文章导入
        <template #content>
          <a-doption @click="showArticleImportModal(id)">常规导入</a-doption>
          <a-doption disabled>Gitee</a-doption>
          <a-doption disabled>GitHub</a-doption>
        </template>
      </a-dsubmenu>
      <a-dsubmenu v-if="folder">
        <template #icon>
          <icon-export/>
        </template>
        文章导出
        <template #content>
          <a-doption @click="exportToMd(id)">ZIP</a-doption>
          <a-doption @click="exportToUTools(id)">uTools文档插件</a-doption>
          <a-doption @click="exportForEpub(id)">Epub</a-doption>
        </template>
      </a-dsubmenu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {addArticle, addFolder, articleTypes, remove, rename} from "@/pages/note/components/he-context";
import {exportToMd} from "@/pages/note/components/EditorExport";
import {showArticleImportModal} from "@/pages/note/components/ArticleImportModal";
import {useArticleStore} from "@/store/db/ArticleStore";
import {openFolderChoose} from "@/components/ArticePreview/FolderChoose";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useFolderStore} from "@/store/db/FolderStore";
import {exportToUTools} from "@/components/ArticleExport/exportForUtools";
import {exportForEpub} from "@/components/ArticleExport/exportForEpub";

export default defineComponent({
  name: 'EditorTreeMenu',
  props: {
    id: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    folder: {
      type: Boolean,
      default: true,
    },
    more: {
      type: Boolean,
      default: true,
    }
  },
  emits: ['multi'],
  data: () => ({
    articleTypes
  }),
  methods: {
    exportForEpub,
    exportToMd, exportToUTools,
    showArticleImportModal, remove, rename, addFolder, addArticle,
    moveTo(id: number, name: string, article: boolean) {
      let folderId: number | undefined = undefined;
      if (article) {
        // 文章，则需要找父文件夹
        const articleIndex = useArticleStore().articleMap.get(id);
        if (articleIndex) {
          folderId = articleIndex.folder;
        }
      } else {
        folderId = id;
      }
      openFolderChoose(folderId).then(folder => {
        if (article) {
          // 更新文章文件夹
          useArticleStore().updateIndex(id, {folder: folder.id})
            .then(() => MessageUtil.success("移动成功"))
        } else {
          useFolderStore().drop(id, folder.id);
        }
      })
    }
  },
});
</script>
<style scoped>

</style>
