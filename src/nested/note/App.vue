<template>
  <div class="app kb-note">
    <div class="option">
      <div style="width: 50%;max-width: 230px">
        <t-tree-select :data="folderTree" v-model="folder" :loading="loading"/>
      </div>
      <t-space size="small">
        <t-popconfirm content="二次确认" @confirm="onSubmit()" confirm-btn="新建" placement="bottom-right">
          <t-button theme="primary" :loading="loading">新建</t-button>
        </t-popconfirm>
      </t-space>
    </div>
    <div class="container kb-wang-editor">
      <rich-text-editor v-model="content" ref="editorRef"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import MessageUtil from "@/utils/modal/MessageUtil";
import {_addArticle} from "@/pages/note/components/he-context";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import RichTextEditor from '@/editor/RichTextEditor/index.vue';
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const editorRef = ref();

useGlobalStore().initDarkColors();
useArticleStore().init();
useFolderStore().init();

const folder = useUtoolsKvStorage(LocalNameEnum.WINDOW_NOTE_FOLDER, 0);
const loading = ref(false);
const content = ref('');

const folderTree = computed(() => useFolderStore().folderTree);


function onSubmit() {
  loading.value = true;
  _addArticle(folder.value, ArticleTypeEnum.RICH_TEXT, content.value)
    .then(() => {
      MessageUtil.success("新建成功");
      content.value = '';
      editorRef.value && editorRef.value.setContent("");
    })
    .catch(e => MessageUtil.error("新建失败", e))
    .finally(() => loading.value = false);
}


</script>
<style scoped lang="less">
.kb-note {
  background-color: var(--color-bg-1);

  .option {
    display: flex;
    justify-content: space-between;
    padding: 7px;
  }

  .container {
    position: absolute;
    top: 46px;
    left: 7px;
    right: 7px;
    bottom: 7px;

    .note {
      position: relative;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
