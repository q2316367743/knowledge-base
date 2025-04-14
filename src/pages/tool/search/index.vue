<template>
  <div class="tool-search">
    <t-card class="header" :bordered="false" size="small">
      <t-space direction="vertical" size="small" style="width: 100%">
        <t-row :gutter="[16, 16]">
          <t-col flex="120px">
            <t-select v-model="type" style="width: 120px" :disabled="loading">
              <t-option :value="0" label="全部"/>
              <t-option
                v-for="articleType in articleTextTypes"
                :key="articleType.key"
                :value="articleType.key"
                :label="articleType.name"
              />
            </t-select>
          </t-col>
          <t-col flex="auto">
            <t-input
              v-model="keyword"
              :placeholder="SearchContentPlaceholder"
              :disabled="loading"
              :clearable="true"
              @enter="searchContent"
            />
          </t-col>
          <t-col flex="32px">
            <t-button theme="danger" :disabled="!loading" @click="stop">
              <template #icon>
                <close-icon />
              </template>
            </t-button>
          </t-col>
        </t-row>
        <t-row>
          <t-col>
            <t-space>
              <t-checkbox v-model="ignoreCase" :disabled="loading">忽略大小写</t-checkbox>
              <t-checkbox v-model="wholeWord" :disabled="loading">全词匹配</t-checkbox>
              <t-checkbox v-model="useRegex" :disabled="loading">正则匹配</t-checkbox>
            </t-space>
          </t-col>
        </t-row>
      </t-space>
    </t-card>
    <t-layout class="container w-full">
      <t-alert v-if="loading" :message="text"/>
      <t-list :split="false" :max-height="maxHeight" class="w-full">
        <t-list-item v-for="item in items" :key="item.value">
          <t-list-item-meta>
            <template #title>
              <t-tag theme="primary">{{ renderArticleType(item.type) }}</t-tag>
              <t-link
                hover="underline"
                theme="primary"
                @click="openArticle(item.value)"
                style="margin-left: 8px"
              >
                {{ item.title }}
                <t-tooltip content="打开预览">
                  <round-icon />
                </t-tooltip>
              </t-link>
            </template>
            <template #description>
              <span v-html="item.html"></span>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-tooltip content="跳转到编辑器">
              <t-button variant="text" shape="square" @click="jumpToArticle(item.value)">
                <template #icon>
                  <edit2-icon />
                </template>
              </t-button>
            </t-tooltip>
          </template>
        </t-list-item>
      </t-list>
    </t-layout>
    <t-back-top container=".t-list"/>
  </div>
</template>

<script lang="ts" setup>
import MessageUtil from "@/utils/modal/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {
  _searchContent,
  SearchContentItem,
  SearchContentPlaceholder,
} from "@/pages/note/components/SearchContent";
import {
  articleTextTypes,
  renderArticleType,
} from "@/pages/note/components/he-context";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {openArticle} from "@/components/ArticePreview/OpenArticle";
import {CloseIcon, Edit2Icon, RoundIcon} from "tdesign-icons-vue-next";

const size = useWindowSize();
const router = useRouter();

const keyword = ref("");
const loading = ref(false);
const close = ref(false);
const text = ref("");
const items = ref(new Array<SearchContentItem>());
const type = ref<ArticleTypeEnum | 0>(0);

// 新增搜索选项
const ignoreCase = ref(false);
const wholeWord = ref(false);
const useRegex = ref(false);

const maxHeight = computed(() => size.height.value - 120);

function searchContent() {
  loading.value = true;
  close.value = false;
  text.value = "";
  items.value = [];
  if (keyword.value.trim() === "") {
    loading.value = false;
    close.value = true;
    return;
  }
  _searchContent(keyword.value, close, items, text, type.value, {
    ignoreCase: ignoreCase.value,
    wholeWord: wholeWord.value,
    useRegex: useRegex.value,
  })
    .then(() => MessageUtil.success("搜索完成"))
    .catch((e) => MessageUtil.error("搜索失败", e))
    .finally(() => (loading.value = false));
}

onBeforeUnmount(() => (close.value = true));

function stop() {
  if (close.value) {
    MessageUtil.warning("正在停止中，请勿重复操作");
    return;
  }
  close.value = true;
}

function jumpToArticle(id: number) {
  useHomeEditorStore().openArticle(id);
  router.push("/note");
}
</script>

<style scoped lang="less">
.tool-search {
  margin: 0;
  padding: 0;

  .container {
    margin: 0 auto;
    height: calc(100vh - 81px);
    overflow: auto;
    background-color: var(--td-bg-color-container);
  }
}
</style>
