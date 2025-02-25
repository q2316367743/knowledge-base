<template>
  <t-dialog placement="center" v-model:visible="visible" width="700px">
    <template #header>
      <a-space>
        <icon-edit/>
        <div>智能写作</div>
      </a-space>
    </template>
    <t-paragraph>
      <t-check-tag-group v-model="value" :options="options"/>
    </t-paragraph>
    <t-textarea v-model="text" :autosize="{minRows: 5, maxRows: 100}" :autofocus="true"/>
    <template #footer>
      <div class="w-full flex justify-between">
        <t-button theme="default" >参考文档</t-button>
        <t-button theme="primary" shape="circle" @click="send">
          <template #icon>
            <icon-send />
          </template>
        </t-button>
      </div>
    </template>
  </t-dialog>
</template>
<script lang="ts" setup>
import {CheckTagGroupOption} from "tdesign-vue-next/es/tag/type";
import {useChatStore} from "@/store/components/ChatStore";
import MessageUtil from "@/utils/modal/MessageUtil";

const visible = defineModel({
  type: Boolean,
  default: false
});

const options: Array<CheckTagGroupOption> = ['朋友圈', '文章', '作文', '小说', '故事', '小红书'].map((e, i) => ({
  label: e,
  value: i
}))
const value = ref([0]);
const text = ref('');

function onChange(v: number) {
  switch (v) {
    case 0:
      text.value = '帮我写一个幽默风趣的 [朋友圈] 文案，100~200字，主题是：';
      break;
    case 1:
      text.value = '帮我写一篇正式的[文章]，要求内容充实、有逻辑性，篇幅在 800字左右，主题是：';
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
      text.value = '帮我写一个[小红书]风格的文案，采用二极管标题法，内容：在每段话的开头和结尾都使用emoji。文章结尾需要提取 5-8 个#标签，主题是：';
      break;
    default:
      text.value = '';
  }
}

watch(value, val => onChange(val[0]), {immediate: true});
watch(visible, val => val && onChange(value.value[0]));
// TODO: 参考文档
const send = () => useChatStore()
  .ask(text.value)
  .catch((e) => {
    MessageUtil.error("提问失败", e);
  });
</script>
<style scoped lang="less">

</style>
