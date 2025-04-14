<template>
  <t-dialog placement="center" v-model:visible="visible" width="700px" :footer="false">
    <template #header>
      <t-space size="small">
        <edit2-icon />
        <div>智能写作</div>
      </t-space>
    </template>
    <div class="p-4px">
      <t-paragraph>
        <t-check-tag-group v-model="value" :options="options"/>
      </t-paragraph>
      <t-textarea v-model="text" :autosize="{minRows: 5, maxRows: 100}" :autofocus="true"/>
      <t-paragraph v-if="articles.length > 0">
        <t-space wrap size="small">
          <div class="article-item" v-for="article in articles" :key="article.id">
            <div class="article-item-title ellipsis" :title="article.name">
              {{ article.name }}
            </div>
            <div class="article-item-type">
              <t-tag theme="primary" variant="outline">
                {{ renderArticleType(article.type) }}
              </t-tag>
            </div>
            <div class="article-item-close" @click="onRemove(article.id)">
              <close-icon />
            </div>
          </div>
        </t-space>
      </t-paragraph>
      <t-paragraph>
        <div class="w-full flex justify-between">
          <t-button theme="default" @click="association = true">参考笔记</t-button>
          <t-button theme="primary" shape="circle" @click="send">
            <template #icon>
              <send-icon />
            </template>
          </t-button>
        </div>
      </t-paragraph>
    </div>
    <association-article v-model="association" :article-ids="articleIds" @confirm="onConfirm"/>
  </t-dialog>
</template>
<script lang="ts" setup>
import {CheckTagGroupOption} from "tdesign-vue-next/es/tag/type";
import {useChatStore} from "@/store/components/ChatStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleIndex} from "@/entity/article";
import {renderArticleType} from "@/pages/note/components/he-context";
import AssociationArticle from "@/pages/home/components/AssociationArticle.vue";
import {CloseIcon, Edit2Icon, SendIcon} from "tdesign-icons-vue-next";

const visible = defineModel({
  type: Boolean,
  default: false
});

const options: Array<CheckTagGroupOption> = ['朋友圈', '笔记', '作文', '小说', '故事', '小红书'].map((e, i) => ({
  label: e,
  value: i
}))
const value = ref([0]);
const text = ref('');
const association = ref(false);

const articleIds = ref(new Array<number>());
const articles = computed(() => {
  const {articleMap} = useArticleStore();
  const list = new Array<ArticleIndex>()
  for (const articleId of articleIds.value) {
    const item = articleMap.get(articleId);
    if (item) list.push(item);
  }
  return list;
})

function onChange(v: number) {
  switch (v) {
    case 0:
      text.value = '帮我写一个幽默风趣的 [朋友圈] 文案，100~200字，主题是：';
      break;
    case 1:
      text.value = '帮我写一篇正式的[笔记]，要求内容充实、有逻辑性，篇幅在 800字左右，主题是：';
      break;
    case 2:
      text.value = '帮我写一篇[作文]，500字左右，要求文字表达流畅，有清晰的开头正文和结尾。主题是：';
      break;
    case 3:
      text.value = '帮我编写一个精彩的[小说]，有引人入胜的背景，故事要有悬念感，引发读者对后续情节的好奇，主题是：';
      break;
    case 4:
      text.value = '帮我编写一个有趣的短篇[故事]，确保故事内容引人入胜，主题是：';
      break;
    case 5:
      text.value = '帮我写一个[小红书]风格的文案，采用二极管标题法，内容：在每段话的开头和结尾都使用emoji。笔记结尾需要提取 5-8 个#标签，主题是：';
      break;
    default:
      text.value = '';
  }
}

watch(value, val => onChange(val[0]), {immediate: true});
watch(visible, val => val && onChange(value.value[0]));

function onConfirm(ids: Array<number>) {
  articleIds.value = ids;
}

function onRemove(id: number) {
  articleIds.value = articleIds.value.filter(e => e !== id);
}

const send = () => useChatStore()
  .ask(text.value, articleIds.value)
  .catch((e) => {
    MessageUtil.error("提问失败", e);
  });
</script>
<style scoped lang="less">
.article-item {
  position: relative;
  padding: 6px 8px;
  background-color: var(--td-bg-color-component);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--td-radius-medium);
  transition: background-color 0.3s ease-in-out;
  max-width: 120px;


  &:hover {
    background-color: var(--td-bg-color-component-hover);
    border: 1px solid var(--td-border-level-2-color);

    .article-item-close {
      opacity: 1;
    }
  }

  .article-item-type {
    margin-top: 6px;
  }

  .article-item-close {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: var(--td-error-color);
    border-radius: var(--td-radius-circle);
    color: #fff;
    width: 16px;
    height: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    font-size: 10px;
    opacity: 0;

    &:hover {
      background-color: var(--td-error-color-hover);
    }
  }
}
</style>
