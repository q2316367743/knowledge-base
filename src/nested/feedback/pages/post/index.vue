<template>
  <t-layout class="add-feedback-dialog">
    <t-content>
      <t-paragraph>
        <t-radio-group v-model="type">
          <t-radio-button v-for="item in types" :value="item.value">{{ item.label }}</t-radio-button>
        </t-radio-group>
      </t-paragraph>
      <t-paragraph>
        <feedback-md-editor v-model="content"/>
      </t-paragraph>
    </t-content>
    <div class="flex justify-between items-center absolute left-8px right-8px bottom-8px">
      <t-tag theme="primary">版本：{{ Constant.version }}</t-tag>
      <t-space size="small" class="flex justify-end">
        <t-button theme="default" @click="goBack">返回</t-button>
        <t-button theme="primary" @click="onSubmit">提交</t-button>
      </t-space>
    </div>
  </t-layout>
</template>
<script lang="ts" setup>
import {pluginField, PluginFieldView} from "@/nested/feedback/apis/plugin";
import {RadioOptionObj} from "tdesign-vue-next";
import FeedbackMdEditor from "@/nested/feedback/components/FeedbackMdEditor.vue";
import Constant from "@/global/Constant";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {feedbackPost} from "@/nested/feedback/apis/feedback/post";

const router = useRouter();

const types: Array<RadioOptionObj> = [
  {
    label: '提建议',
    value: 1
  }, {
    label: '提缺陷',
    value: 2
  }, {
    label: '我想要',
    value: 3
  }
]

const fields = ref(new Array<PluginFieldView>());

const type = ref(1);
const content = ref('');
const fieldValue = ref<Record<string, string>>({});
const extraParams = useSessionStorage<Record<string, string>>('extra-params', {});

onMounted(() => {
  pluginField()
    .then(res => {
      fields.value = res;
      const params = extraParams.value
      if (params && Object.keys(params).length > 0) {
        for (const key in params) {
          fieldValue.value[key.substring(1)] = `${params[key]}`;
        }
      }
      fieldValue.value['1896795064271175680'] = Constant.version
    });
});

async function onSubmit() {
  if (isEmptyString(content.value)) return MessageUtil.error("请输入反馈内容");
  for (let field of fields.value) {
    if (field.required) {
      if (isEmptyString(fieldValue.value[field.id])) {
        MessageUtil.error(`字段【${field.field}】是必填的`);
        return;
      }
    }
  }
  await feedbackPost({
    type: type.value,
    content: content.value,
    fields: fieldValue.value
  });
  MessageUtil.success("发布成功");
  goBack();
}

function goBack() {
  router.push('/home')
}
</script>
<style scoped lang="less">
.add-feedback-dialog {
  padding: 0 8px;
  height: 100vh;
}
</style>
