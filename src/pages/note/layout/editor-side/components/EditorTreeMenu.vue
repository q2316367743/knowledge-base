<template>
  <t-dropdown trigger="click">
    <slot></slot>
    <t-dropdown-menu>
      <t-dropdown-item v-if="folder">
        <template #prefix-icon>
          <plus-icon />
        </template>
        新增笔记
        <t-dropdown-menu>
          <t-dropdown-item v-for="articleType in articleTypes" :key="articleType.key"
                           @click="addArticle(id, articleType)">
            <template #prefix-icon>
              <component :is="articleType.icon"/>
            </template>
            <div class="flex items-center">
              <div>{{ articleType.name }}</div>
              <vip-icon v-if="articleType.vip && noteNoVip" class="ml-8px"/>
            </div>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item v-if="folder" @click="addFolder(id)">
        <template #prefix-icon>
          <folder-add1-icon />
        </template>
        新建文件夹
      </t-dropdown-item>
      <t-dropdown-item v-if="folder && more">
        <template #prefix-icon>
          <app-icon />
        </template>
        更多操作
        <t-dropdown-menu>
          <t-dropdown-item @click="$emit('multi',id)">
            <template #prefix-icon>
              <check-rectangle-icon />
            </template>
            多选
          </t-dropdown-item>
          <t-dropdown-item @click="rename(id, name, !folder)">
            <template #prefix-icon>
              <edit2-icon />
            </template>
            重命名
          </t-dropdown-item>
          <t-dropdown-item @click="remove(id, name, !folder)"
                           style="color: red;">
            <template #prefix-icon>
              <delete-icon />
            </template>
            删除
          </t-dropdown-item>
          <t-dropdown-item @click="moveTo(id, name, !folder)">
            <template #prefix-icon>
              <gesture-right-icon />
            </template>
            移动到
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item v-if="!folder"
                       @click="rename(id, name, !folder)">
        <template #prefix-icon>
          <edit2-icon />
        </template>
        重命名
      </t-dropdown-item>
      <t-dropdown-item v-if="!folder">
        <template #prefix-icon>
          <app-icon />
        </template>
        更多操作
        <t-dropdown-menu>
          <t-dropdown-item @click="rename(id, name, !folder)">
            <template #prefix-icon>
              <fill-color1-icon />
            </template>
            设置颜色
          </t-dropdown-item>
          <t-dropdown-item @click="remove(id, name, !folder)"
                           style="color: red;">
            <template #prefix-icon>
              <delete-icon />
            </template>
            删除
          </t-dropdown-item>
          <t-dropdown-item @click="moveTo(id, name, !folder)">
            <template #prefix-icon>
              <gesture-right-icon />
            </template>
            移动到
          </t-dropdown-item>
          <t-dropdown-item @click="$emit('multi',id)">
            <template #prefix-icon>
              <check-rectangle-icon />
            </template>
            多选
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item v-if="folder">
        <template #prefix-icon>
          <file-import-icon />
        </template>
        笔记导入
        <t-dropdown-menu>
          <t-dropdown-item @click="showArticleImportModal(id)">常规导入</t-dropdown-item>
          <t-dropdown-item :disabled="true">Gitee</t-dropdown-item>
          <t-dropdown-item :disabled="true">GitHub</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item v-if="folder">
        <template #prefix-icon>
          <file-export-icon />
        </template>
        笔记导出
        <t-dropdown-menu>
          <t-dropdown-item @click="exportToMd(id)">ZIP</t-dropdown-item>
          <t-dropdown-menu @click="exportToUTools(id)">uTools文档插件</t-dropdown-menu>
          <t-dropdown-item @click="exportForEpub(id)">Epub</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
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
import VipIcon from "@/components/KbIcon/VipIcon.vue";
import {mapState} from "pinia";
import {useVipStore} from "@/store";
import {
  AppIcon,
  CheckRectangleIcon,
  DeleteIcon,
  Edit2Icon, FileExportIcon, FileImportIcon, FillColor1Icon,
  FolderAdd1Icon,
  GestureRightIcon,
  PlusIcon
} from "tdesign-icons-vue-next";

export default defineComponent({
  name: 'EditorTreeMenu',
  components: {
    FileExportIcon,
    FileImportIcon,
    FillColor1Icon,
    GestureRightIcon, DeleteIcon, Edit2Icon, CheckRectangleIcon, AppIcon, FolderAdd1Icon, PlusIcon, VipIcon},
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
  computed: {
    ...mapState(useVipStore, ['noteNoVip'])
  },
  methods: {
    exportForEpub,
    exportToMd, exportToUTools,
    showArticleImportModal, remove, rename, addFolder, addArticle,
    moveTo(id: number, name: string, article: boolean) {
      let folderId: number | undefined = undefined;
      if (article) {
        // 笔记，则需要找父文件夹
        const articleIndex = useArticleStore().articleMap.get(id);
        if (articleIndex) {
          folderId = articleIndex.folder;
        }
      } else {
        folderId = id;
      }
      openFolderChoose(folderId).then(folder => {
        if (article) {
          // 更新笔记文件夹
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
