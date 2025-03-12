<template>
  <div class="news-list-item group relative flex" v-if="item && index">
    <div class="cursor-menu group relative flex pl-3 pr-2 py-4">
      <span class="shrink-0 mr-2" style="width: 20px; height: 20px;" v-if="index.icon">
        <img class=" rounded-sm object-cover center mr-2" :src="index.icon" style="width: 20px; height: 20px;"
             :alt="index.name">
      </span>
      <div class="-mt-0.5 flex-1 text-sm leading-tight line-clamp-[4]" style="max-width: calc(100% - 116px);">
        <div class="flex gap-1  font-bold text-zinc-400 dark:text-neutral-500 items-center">
          <div class="block truncate">
            <div class="flex select-none items-center truncate space-x-0.5">
              <span class="block truncate">{{ item.author || index.name }}</span>
            </div>
          </div>
          <t-tooltip v-if="item.pubDate" :content="toDateString(item.pubDate)">
            <t-tag theme="primary" size="small" variant="outline" class="ml-2">
              {{ prettyDate(item.pubDate) }}
            </t-tag>
          </t-tooltip>
        </div>
        <div class="news-list-item__title">{{ item.title }}</div>
        <div class="news-list-item__desc">{{ item.description }}</div>
      </div>
      <span data-state="loaded" class="relative overflow-hidden center ml-2 flex shrink-0 rounded size-20"
            v-if="item.image">
        <img height="560" width="840" loading="lazy"
             class="size-full object-contain duration-200 opacity-100 !my-0 w-auto h-auto rounded"
             :src="item.image" :alt="item.title">
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {NewsIndex, NewsInstance} from "@/entity/news";
import {prettyDate, toDateString} from '@/utils/lang/FormatUtil.ts';

defineProps({
  item: {
    type: Object as PropType<NewsInstance>,
    required: true
  },
  index: {
    type: Object as PropType<NewsIndex>
  }
})
</script>
<style scoped lang="less">
.news-list-item {
  transition: background-color 0.3s;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }

  .news-list-item__title {
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-title-medium);
    margin-top: 8px;
  }

  .news-list-item__desc {
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
    margin-top: 4px;
  }
}
</style>
