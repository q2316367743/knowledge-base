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
        <t-tooltip content="默认浏览器打开">
          <t-button theme="primary" variant="text" shape="square" size="small" @click="openLink">
            <template #icon>
              <link-icon/>
            </template>
          </t-button>
        </t-tooltip>
      </t-space>
      <div class="page-header__right mr-4">
        <t-space size="small" class="items-center">
          <t-input-number v-model="scale" :min="80" :max="200" :step="10" size="small" style="width: 120px;">
            <template #suffix>%</template>
          </t-input-number>
          <t-tag v-if="article" theme="primary" size="small">{{ updateTime }}</t-tag>
          <t-tooltip content="强制刷新" placement="bottom-right">
            <t-button theme="primary" variant="text" shape="square" @click="init">
              <template #icon>
                <refresh-icon/>
              </template>
            </t-button>
          </t-tooltip>
        </t-space>
      </div>
    </header>
    <main class="page-container">
      <t-loading :loading class="w-full h-full" text="正在加载中">
        <div class="page-container-content">
          <chat-content :value="article?.markdown"/>
        </div>
      </t-loading>
    </main>
    <t-back-top container=".page-container"/>
  </div>
</template>
<script lang="ts" setup>
import {ArrowLeftIcon, LinkIcon, RefreshIcon} from "tdesign-icons-vue-next";
import {NewsArticle} from "@/entity/news";
import {useNewsStore} from "@/store/db/NewsStore";
import {prettyDate} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useIntervalComputer} from "@/hooks/IntervalComputer";
import {getNewsArticle} from "@/modules/NoteNews";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;
const title = ref(route.query.title as string);

const article = ref<NewsArticle>();
const loading = ref(true);
const scale = useUtoolsDbStorage<number>(`${LocalNameEnum.KEY_NEWS_CONTENT_SCALE}/${id}`, 100);

const updateTime = useIntervalComputer(() => article.value ? prettyDate(article.value.date) : '', 1000);

const fontSize = computed(() => `${scale.value}%`);

const init = async () => {
  try {
    loading.value = true;
    const {getNewsRule} = useNewsStore();
    const rule = await getNewsRule(id);
    if (!rule) {
      return Promise.reject(new Error("资讯规则不存在"));
    }
    article.value = await getNewsArticle(route.query.link as string, rule);
    if (article.value.title) {
      title.value = article.value.title;
    }
  } catch (e) {
    MessageUtil.error("获取内容失败", e);
  } finally {
    loading.value = false;
  }
};

onMounted(init);

function handlerClick() {
  router.back();
}


function openLink() {
  utools.shellOpenExternal(route.query.link as string);
}

</script>
<style scoped lang="less">
.news-content {
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
      max-width: 50vw;
    }

  }

  .page-container {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    :deep(p) {
      font-size: v-bind(fontSize) !important;
    }

    .page-container-content {
      padding: 8px 16px;
    }
  }

  .empty {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
}
</style>
