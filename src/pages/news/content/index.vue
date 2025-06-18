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
          <t-tooltip content="强制刷新" placement="bottom">
            <t-button theme="primary" variant="text" shape="square" @click="init">
              <template #icon>
                <refresh-icon/>
              </template>
            </t-button>
          </t-tooltip>
          <t-tooltip content="保存笔记" placement="bottom-right">
            <t-button theme="primary" variant="text" shape="square" @click="handleSave">
              <template #icon>
                <save-icon/>
              </template>
            </t-button>
          </t-tooltip>
        </t-space>
      </div>
    </header>
    <main class="page-container">
      <t-loading :loading class="w-full h-full" text="正在加载中">
        <div class="page-container-content">
          <markdown-preview :value="article?.markdown"/>
        </div>
      </t-loading>
    </main>
    <t-back-top container=".page-container"/>
  </div>
</template>
<script lang="ts" setup>
import {ArrowLeftIcon, LinkIcon, RefreshIcon, SaveIcon} from "tdesign-icons-vue-next";
import {NewsArticle, NewsIndex} from "@/entity/news";
import {prettyDate} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import {useIntervalComputer} from "@/hooks/IntervalComputer";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getNewsArticle} from "@/modules/NoteNews";
import {addArticleModal} from "@/pages/note/components/he-context";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {useHomeEditorStore, useNewsStore} from "@/store";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;
const title = ref(route.query.title as string);

const article = ref<NewsArticle>();
const loading = ref(true);
const newsIndex = shallowRef<NewsIndex>()
const scale = useUtoolsDbStorage<number>(`${LocalNameEnum.KEY_NEWS_CONTENT_SCALE}/${id}`, 100);

const updateTime = useIntervalComputer(() => article.value ? prettyDate(article.value.date) : '', 1000);

const fontSize = computed(() => `${scale.value}%`);

const init = async () => {
  try {
    loading.value = true;
    const {getNewsRule, getNewsIndex} = useNewsStore();
    newsIndex.value = getNewsIndex(id);
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
  InjectionUtil.shellOpenExternal(route.query.link as string);
}

function handleSave() {
  if (!article.value) return MessageUtil.warning("文章内容为空")
  addArticleModal({
    sourceName: article.value.title ?? "",
    content: article.value.markdown ?? "",
    showTypeRadio: false,
    defaultType: ArticleTypeEnum.MARKDOWN,
    autoOpen: false,
    extra: {
      preview: true,
    },
    base: {
      source: newsIndex.value?.name,
      sourceUrl: route.query.link as string,
    },
    onSuccess: (article) => {
      NotificationUtil.confirm("保存成功", "保存文章", {
        confirmButtonText: "立即打开",
        cancelButtonText: "稍后打开",
      }).then(() => {
        useHomeEditorStore().openArticle(article);
        router.push('/note')
      })
    }
  })
}

</script>
<style scoped lang="less">
.news-content {
  height: 100%;
  width: 100%;
  position: relative;

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
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    :deep(p) {
      font-size: v-bind(fontSize) !important;
    }

    :deep(a) {
      display: inline-flex;
      cursor: pointer;
      align-items: center;
      position: relative;
      text-decoration: none;
      outline: none;
      padding: 0;
      transition: all .2s linear;
      font: var(--td-font-link-medium);
      color: var(--td-text-color-link);

      &:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 0;
        bottom: 0;
        opacity: 1;
        border-bottom: 1px solid transparent;
        transition: all .2s linear
      }

      &:hover {
        &:after {
          border-bottom: 1px solid var(--td-text-color-link);
        }

      }

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
