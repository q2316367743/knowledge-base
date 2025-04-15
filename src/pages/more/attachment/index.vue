<template>
  <div style="padding: 8px">
    <t-space direction="horizontal" size="medium" :break-line="true">
      <t-card
        v-for="attachment in attachments" :key="attachment" theme="poster2"
        :cover="renderAttachmentUrl(attachment)" :bordered="true" :style="{ width: '350px' }">
        <template #footer>
          <t-space>
            <t-button size="small" theme="primary" @click="copyMarkdown(attachment)">复制markdown链接</t-button>
            <t-button size="small" theme="primary" @click="copyHtml(attachment)">复制html链接</t-button>
          </t-space>
        </template>
        <template #actions>
          <t-button size="small" theme="danger" @click="remove(attachment)">删除</t-button>
        </template>
      </t-card>
    </t-space>
  </div>
</template>
<script lang="ts" setup>
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {listRecordByAsync, removeOneByAsync} from "@/utils/utools/DbStorageUtil";
import {renderAttachmentUrl} from "@/plugin/server";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const attachments = ref(new Array<string>());

function fetchAttachment() {
  attachments.value = [];
  listRecordByAsync<any>(LocalNameEnum.ARTICLE_ATTACHMENT)
    .then(items => {
      items.forEach(item => attachments.value.push(item.id))
    })
}

fetchAttachment();

function copyMarkdown(item: string) {
  InjectionUtil.copyText(`![image.png#100%](attachment:${item})`);
  MessageUtil.success("成功复制到剪切板");
}

function copyHtml(item: string) {
  InjectionUtil.copyText(renderAttachmentUrl(item));
  MessageUtil.success("成功复制到剪切板");
}


function remove(item: string) {
  MessageBoxUtil.confirm("删除此附件后，使用的笔记将无法展示附件", "删除确认", {
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  }).then(() => {
    removeOneByAsync(item)
      .then(() => {
        fetchAttachment();
        MessageUtil.success("删除成功");
      }).catch(e => MessageUtil.error("删除失败", e));
  })
}

</script>
<style scoped lang="less">
</style>
