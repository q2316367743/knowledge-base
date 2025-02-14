<template>
  <a-tooltip :content="disabled ? '请先配置运行命令' : '代码运行'" position="br" v-if="show">
    <a-button status="success" type="text" @click="run">
      <template #icon>
        <icon-play-arrow/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script lang="ts" setup>
import {ArticleIndex} from "@/entity/article";
import {homeEditorId} from "@/store/components/HomeEditorStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {codeRun, disabledCodeRun} from "@/plugin/CodeRun";
import MessageUtil from "@/utils/modal/MessageUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";

const router = useRouter();

const currentIndex = computed<ArticleIndex | undefined>(() => {
  const {articleMap} = useArticleStore();
  if (homeEditorId.value > 0) {
    return articleMap.get(homeEditorId.value);
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
  if (!currentIndex.value) {
    return Promise.reject("未知笔记，无法运行")
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
  if (disabled.value) {
    NotificationUtil.alert('请先配置运行命令', "代码运行", {
      confirmButtonText: '立即前往'
    }).then(() => {
      router.push("/setting/code-run")
    });
    return;
  }
  runWrap().then(() => {
    MessageUtil.info("运行成功")
  }).catch((e) => {
    MessageUtil.error(e)
  })
}
</script>
<style scoped lang="less">

</style>
