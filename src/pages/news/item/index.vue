<template>
  <div class="news-list-item">
    <header class="page-header">
      <div size="small" class="page-header__left">
        <div class="page-header__title">{{ idx?.name }}</div>
      </div>
      <div class="page-header__right flex mr-8px items-center">
        <div v-if="cache" class="mr-8px news-list-item__date">
          上次刷新：{{ prettyDate(cache.date) }}
        </div>
        <t-tooltip content="强制刷新" placement="bottom-right">
          <t-button theme="primary" variant="outline" shape="square" @click="refresh" :loading="loading">
            <template #icon>
              <refresh-icon/>
            </template>
          </t-button>
        </t-tooltip>
      </div>
    </header>
    <div class="page-container">
      <t-loading :loading class="w-full h-full" text="正在加载中">
        <div v-if="cache && (cache.data.length > 0 || loading)" class="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 m-4px">
          <news-list-item v-for="item in cache.data" :index="idx" :item="item" @click="onPush(item)"/>
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
import {RefreshIcon} from "tdesign-icons-vue-next";
import {NewsInstance, NewsInstanceCache} from "@/entity/news";
import {useNewsStore} from "@/store/db/NewsStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {prettyDate} from "@/utils/lang/FormatUtil";
import NewsListItem from "@/pages/news/components/NewsListItem.vue";

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const cache = ref<NewsInstanceCache>();
const loading = ref(false);

watch(id, value => {
  cache.value = undefined;
  if (id) {
    loading.value = true;
    useNewsStore().getNews(value)
      .then(res => cache.value = res)
      .catch(e => MessageUtil.error("资讯查询失败", e))
      .finally(() => loading.value = false);
  }
}, {immediate: true})

const idx = computed(() => useNewsStore().getNewsIndex(id.value));


function refresh() {
  loading.value = true;
  useNewsStore().getNews(id.value, true)
    .then(res => cache.value = res)
    .catch(e => MessageUtil.error("资讯查询失败", e))
    .finally(() => loading.value = false);
}

function onPush(item: NewsInstance) {
  router.push({
    path: `/news/content/${id.value}`,
    query: {
      title: item.title,
      link: item.link
    }
  })
}

</script>
<style scoped lang="less">
.news-list-item {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: var(--td-bg-color-container);

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--td-border-level-1-color);
    height: 41px;
    box-sizing: border-box;

    &__left {
      display: flex;
      align-items: center;
      padding-left: 4px;
    }

    &__title {
      display: flex;
      align-items: center;
      padding-left: 12px;
    }

    .news-list-item__date {
      color: var(--td-text-color-secondary);
    }

  }

  .page-container {
    position: absolute;
    top: 41px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .empty {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
}
</style>
