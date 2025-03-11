<template>
  <div class="news-list-item">
    <header class="page-header">
      <t-space size="small" class="page-header__left">
        <t-button theme="primary" variant="text" shape="square" @click="handlerClick">
          <template #icon>
            <menu-fold-icon v-if="newsSideCollapse"/>
            <menu-unfold-icon v-else/>
          </template>
        </t-button>
        <div class="page-header__title">{{ idx?.name }}</div>
      </t-space>
      <div class="page-header__right mr-4">
        <t-tooltip content="强制刷新" placement="bottom-right">
          <t-button theme="primary" variant="text" shape="square" @click="refresh">
            <template #icon>
              <refresh-icon/>
            </template>
          </t-button>
        </t-tooltip>
      </div>
    </header>
    <div class="page-container">
      <t-loading :loading class="w-full h-full" text="正在加载中">
        <div v-if="list.length>0 || loading">
          <news-list-item v-for="item in list" :index="idx" :item="item"/>
        </div>
        <div class="empty" v-else>
          <div class="empty-c">
            <t-empty title="暂无内容" description="可以尝试刷新重试"/>
          </div>
        </div>
      </t-loading>
    </div>
    <t-back-top container=".news-list-item .page-container"/>
  </div>
</template>
<script lang="ts" setup>
import {NewsInstance} from "@/entity/news";
import {newsSideCollapse, useNewsStore} from "@/store/db/NewsStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {MenuFoldIcon, MenuUnfoldIcon, RefreshIcon} from "tdesign-icons-vue-next";
import NewsListItem from "@/pages/news/components/NewsListItem.vue";

const route = useRoute();

const id = computed(() => route.params.id as string);

const list = ref(new Array<NewsInstance>());
const loading = ref(false);

watch(id, value => {
  list.value = [];
  if (id) {
    loading.value = true;
    useNewsStore().getNews(value)
      .then(res => list.value = res)
      .catch(e => MessageUtil.error("资讯查询失败", e))
      .finally(() => loading.value = false);
  }
}, {immediate: true})

const width = computed(() => `calc(100vw - ${48 + 1 + (newsSideCollapse.value ? 0 : 232)}px)`);
const idx = computed(() => useNewsStore().getNewsIndex(id.value));

function handlerClick() {
  newsSideCollapse.value = !newsSideCollapse.value;
}

function refresh() {
  loading.value = true;
  useNewsStore().getNews(id.value, true)
    .then(res => list.value = res)
    .catch(e => MessageUtil.error("资讯查询失败", e))
    .finally(() => loading.value = false);

}
</script>
<style scoped lang="less">
.news-list-item {
  height: 100%;
  width: v-bind(width);
  position: relative;
  background-color: var(--td-bg-color-container);

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--td-border-level-1-color);
    height: 50px;
    box-sizing: border-box;

    &__left {
      display: flex;
      align-items: center;
      padding-left: 8px;
    }

    &__title {
      display: flex;
      align-items: center;
    }

  }

  .page-container {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }

  .empty {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
}
</style>
