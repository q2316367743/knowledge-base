<template>
  <a-tooltip content="代码运行" position="bottom" v-if="show">
    <a-button status="success" type="text" :disabled @click="run">
      <template #icon>
        <icon-play-arrow/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script lang="ts" setup>
import {ArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {codeRun, disabledCodeRun} from "@/plugin/CodeRun";
import MessageUtil from "@/utils/modal/MessageUtil";

const currentIndex = computed<ArticleIndex | undefined>(() => {
  const {id} = useHomeEditorStore();
  const {articleMap} = useArticleStore();
  if (id > 0) {
    return articleMap.get(id);
  }
  return undefined
});
const show = computed(() => {
  if (!currentIndex.value) {
    return false;
  }
  const {type} = currentIndex.value;
  return type === ArticleTypeEnum.CODE;
});
const disabled = computed(() => {
  if (!currentIndex.value) return true;
  const {name} = currentIndex.value;
  return disabledCodeRun(name);
});

async function runWrap() {
  if (!currentIndex.value){
    return Promise.reject("未知笔记，无法运行")
  }
  if (disabled.value) {
    return Promise.reject("当前笔记不支持运行")
  }
  const {id, name} = currentIndex.value;
  const {getContent} = useArticleStore();
  // 内容
  const contentWrap = await getContent(id);
  if (!contentWrap.record) {
    return Promise.reject("系统异常，代码内容未找到")
  }
  await codeRun(name, contentWrap.record.content)
}

function run() {
  runWrap().then(() => {
    MessageUtil.info("运行成功")
  }).catch((e) => {
    MessageUtil.error(e)
  })
}
</script>
<style scoped lang="less">

</style>
