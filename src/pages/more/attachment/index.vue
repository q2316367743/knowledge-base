<template>
  <div class="more-attachment">
    <a-image-preview-group infinite>
      <a-space wrap>
        <a-card :style="{ width: '351px' }" v-for="attachment in attachments" :key="attachment">
          <template #actions>
            <a-button size="mini" type="text" @click="copyMarkdown(attachment)">复制markdown链接</a-button>
            <a-button size="mini" type="text" @click="copyHtml(attachment)">复制html链接</a-button>
            <a-button size="mini" type="text" status="danger" @click="remove(attachment)">删除</a-button>
          </template>
          <template #cover>
            <div style="display: flex;justify-content: center;align-items: center">
              <a-image :src="renderAttachmentUrl(attachment)" height="120px"/>
            </div>
          </template>
          <a-card-meta>
            <template #title>
              <a-typography-text>{{ attachment }}</a-typography-text>
            </template>
          </a-card-meta>
        </a-card>
      </a-space>
    </a-image-preview-group>
    <a-back-top target-container=".more-attachment" />
  </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {listRecordByAsync, removeOneByAsync} from "@/utils/utools/DbStorageUtil";
import {renderAttachmentUrl} from "@/plugin/server";

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
  utools.copyText(`![](${item})`);
  MessageUtil.success("成功复制到剪切板");
}

function copyHtml(item: string) {
  utools.copyText(`![](${renderAttachmentUrl(item)})`);
  MessageUtil.success("成功复制到剪切板");
}


function remove(item: string) {
  MessageBoxUtil.confirm("删除此附件后，使用的文章将无法展示附件", "删除确认", {
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
.more-attachment {
  padding: 8px 8px 0;
  height: calc(100vh - 16px);
  overflow: auto;
}
</style>
