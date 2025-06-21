<template>
  <empty-result v-if="attachments.length === 0" title="附件管理" tip="空空如也"/>
  <div v-else class="more-attachment">
    <div class="waterfall-container">
      <div v-for="attachment in attachments" :key="attachment.key" class="waterfall-item">
        <div class="image-container">
          <t-image
            :src="attachment.url"
            :style="{ width: '100%' }"
            :lazy="true"
            :loading="'lazy'"
            fit="cover"
            class="attachment-image"
          />
        </div>
        <div class="image-overlay">
          <t-space size="small">
            <t-button size="small" theme="primary" @click="copyMarkdown(attachment)">复制markdown链接</t-button>
            <t-button size="small" theme="primary" @click="copyHtml(attachment)">复制html链接</t-button>
            <t-button size="small" theme="danger" @click="remove(attachment)">删除</t-button>
          </t-space>
        </div>
      </div>
    </div>
    <t-back-top container=".more-attachment"/>
  </div>
</template>
<script lang="ts" setup>
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {AttachmentInfo, deleteAttachment, listAttachment} from "@/utils/utools/AttachmentUtil";

const attachments = ref(new Array<AttachmentInfo>());

function fetchAttachment() {
  attachments.value = [];
  listAttachment()
    .then(items => attachments.value = items)
}

fetchAttachment();

const copyMarkdown = (item: AttachmentInfo) => InjectionUtil.copyText(`![${item.filename}#100%](attachment:${item.key})`);
const copyHtml = (item: AttachmentInfo) => InjectionUtil.copyText(item.url);


function remove(item: AttachmentInfo) {
  MessageBoxUtil.confirm("删除此附件后，使用的笔记将无法展示附件", "删除确认", {
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  }).then(() => {
    deleteAttachment(item)
      .then(() => {
        fetchAttachment();
        MessageUtil.success("删除成功");
      }).catch(e => MessageUtil.error("删除失败", e));
  })
}

</script>
<style scoped lang="less">
.more-attachment {
  padding: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 64px);
  overflow: auto;
}

.waterfall-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 16px;
  grid-auto-flow: dense;
}

.waterfall-item {
  break-inside: avoid;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:hover .image-overlay {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover .attachment-image {
    transform: scale(1.05);
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 12px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 2;
  }

  .image-container {
    position: relative;
    overflow: hidden;

    .attachment-image {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.3s ease;
    }


  }
}

</style>
