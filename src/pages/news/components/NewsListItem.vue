<template>
  <div class="pb-8px">
    <div class="t-card t-card--bordered news-list-item relative flex overflow-hidden" v-if="item && index">
      <div class="flex flex-col md:flex-row w-full">
        <div class="md-w-1/3" v-if="item.image">
          <img class="w-full h-full object-cover" :src="item.image" :alt="item.title"/>
        </div>
        <div class="flex flex-1 flex-col md:w-2/3">
          <div class="news-list-item__header pb-2">
            <div class="tags-wrapper">
              <div class="flex gap-2 flex-nowrap overflow-hidden">
                <t-tag v-for="c in item.category" v-if="item.category" theme="primary" variant="outline" shape="round">
                  {{ c }}
                </t-tag>
              </div>
            </div>
            <div class="news-list-item__title line-clamp-1 text-lg" @click="onPush(item)">{{ item.title }}</div>
            <div class="news-list-item__desc line-clamp-2 mt-1" @click="onPush(item)">{{ item.description }}</div>
          </div>
          <div class="news-list-item__content">
            <div class="flex items-center text-sm text-muted-foreground">
              <span>{{ index.name }}</span>
              <span class="mx-1">·</span>
              <span v-if="item.pubDate">{{ toDateTimeString(item.pubDate) }}</span>
            </div>
          </div>
          <div class="news-list-item__footer flex items-center justify-between pt-0">
            <div class="flex items-center gap-2">
              <t-avatar :image="index.icon">{{ index.name.slice(0, 1) }}</t-avatar>
              <span class="text-sm font-medium">{{ item.author || index.name }}</span>
            </div>
            <t-button theme="primary" variant="text" size="small" class="gap-1">
              <template #icon>
                <share-icon/>
              </template>
              分享
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {NewsIndex, NewsInstance} from "@/entity/news";
import {toDateTimeString} from '@/utils/lang/FormatUtil';
import {ShareIcon} from "tdesign-icons-vue-next";

const router = useRouter();

const props = defineProps({
  item: {
    type: Object as PropType<NewsInstance>,
    required: true
  },
  index: {
    type: Object as PropType<NewsIndex>
  }
})
function onPush(item: NewsInstance) {
  router.push({
    path: `/news/content/${props.index?.id}`,
    query: {
      title: item.title,
      link: item.link
    }
  })
}
</script>
<style scoped lang="less">
.news-list-item {
  padding: 8px;

  .news-list-item__header {
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;

    .news-list-item__title {
      cursor: pointer;
      font-weight: bold;
      color: var(--td-text-color-primary);
      font-size: var(--td-font-size-title-medium);
      margin-top: 8px;
    }

    .news-list-item__desc {
      cursor: pointer;
      color: var(--td-text-color-secondary);
      font-size: var(--td-font-size-body-medium);
      margin-top: 4px;
    }
  }

  .news-list-item__content {
    padding: 0 16px 8px;
  }

  .news-list-item__footer {
    padding: 0 16px 16px;
  }
}

.tags-wrapper {
  max-width: 100%;
}
</style>
