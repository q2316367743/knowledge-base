<template>
  <t-form-item label="" label-align="top" help="请输入内容">
    <t-upload accept='image/*' draggable :request-method='customRequest' class='w-full'/>
  </t-form-item>
  <t-form-item label="解析" label-align="top" help="非必填">
    <memo-md-editor v-model="data.analysis"/>
  </t-form-item>
</template>
<script lang="ts" setup>
import {RequestMethodResponse, UploadFile} from "tdesign-vue-next";
import { MemoDataCardImage} from "@/editor/MemoEditor/types";
import MemoMdEditor from "@/editor/MemoEditor/components/MemoMdEditor.vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";

const data = defineModel<Partial<MemoDataCardImage>>({
  default: () => ({
    url: '',
    analysis: ''
  })
})

const customRequest = async (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
  const file = Array.isArray(files) ? files[0] : files;
  if (!file || !file.raw) {
    MessageUtil.success("文件为空，请重新选择文件")
    return {
      status: 'fail',
      error: '文件为空，请重新选择文件',
      response: {}
    }
  }
  const {url} = await useAttachmentUpload.upload(file.raw, file.raw.name, 'image/*');


  data.value.url = url;

  return {
    status: 'success',
    response: {
      url, files: [file]
    }
  }
}
</script>
<style scoped lang="less">

</style>
