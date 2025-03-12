<template>
  <div class="news-content">
    <header class="page-header">
      <t-space size="small" class="page-header__left">
        <t-button theme="primary" variant="text" shape="square" @click="handlerClick">
          <template #icon>
            <arrow-left-icon/>
          </template>
        </t-button>
        <div class="page-header__title">{{ title }}</div>
        <t-tag v-if="article" theme="primary" size="small">{{ prettyDate(article.date) }}</t-tag>
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
        <iframe frameborder="none" :src="url" class="w-full h-full"/>
      </t-loading>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ArrowLeftIcon, RefreshIcon} from "tdesign-icons-vue-next";
import {NewsArticle} from "@/entity/news";
import {getNewsArticle} from "@/algorithm/rule";
import {newsSideCollapse, useNewsStore} from "@/store/db/NewsStore";
import {prettyDate} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;
const title = route.query.title as string;

const article = ref<NewsArticle>();
const loading = ref(true);
const url = ref('');


const width = computed(() => `calc(100vw - ${48 + 1 + (newsSideCollapse.value ? 0 : 232)}px)`);
const idx = computed(() => useNewsStore().getNewsIndex(id));

onMounted(async () => {
  try {
    const {getNewsRule} = useNewsStore();
    const rule = await getNewsRule(id);
    if (!rule) {
      return Promise.reject(new Error("资讯规则不存在"));
    }
    article.value = await getNewsArticle(route.query.link as string, rule);
    url.value = URL.createObjectURL(new Blob([article.value.html], {type: 'text/html'}));
  } catch (e) {
    MessageUtil.error("获取内容失败", e);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (url.value) {
    URL.revokeObjectURL(url.value);
  }
})

function handlerClick() {
  router.back();
}

function refresh() {
}
</script>
<style scoped lang="less">
.news-content {
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
    overflow: hidden;
  }

  .empty {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
}
</style>
