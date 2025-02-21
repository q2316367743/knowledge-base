<template>
  <div class="ai-input">
    <div class="attachment" v-if="attachmentVisible">
      <div class="attachment-item" v-for="item in attachments" :key="item.id">
        <a-image
          class="attachment-item__image"
          v-if="item.type === ChatAttachmentType.IMAGE"
          :src="item.file"
          :alt="item.name"
          width="100px"
          height="50px"
        />
        <div class="close" @click="deleteAttachment(item.id)">
          <icon-delete style="color: rgb(var(--danger-6))" />
        </div>
      </div>
    </div>
    <a-divider :margin="8" v-if="attachmentVisible" />
    <div class="input">
      <!-- TODO: 此处应该换成文本域 -->
      <input
        v-model="question"
        type="text"
        placeholder="提出你的问题，回车提问"
        :disabled="loading"
        @keydown.enter="ask()"
      />
      <div class="module-select">
        <home-assistant-select v-model="model" width="120px" />
      </div>
      <a-divider direction="vertical" :margin="8" />
      <div class="attachment-btn w-64px flex">
        <a-dropdown>
          <a-tooltip content="文件数量：最多支持10个">
            <a-button type="text">
              <template #icon>
                <icon-attachment />
              </template>
            </a-button>
          </a-tooltip>
          <template #content>
            <a-doption>
              <template #icon>
                <icon-file />
              </template>
              本地文件
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-edit />
              </template>
              笔记文件
            </a-doption>
          </template>
        </a-dropdown>
        <a-tooltip content="截图回答，支持图片识别等">
          <a-button type="text" @click="screenShot">
            <template #icon>
              <icon-screenshot style="fill: rgb(var(--arcoblue-6))" />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import IconScreenshot from "@/icon/IconScreenshot.vue";
import { isEmptyString } from "@/utils/lang/FieldUtil";
import { getScreenShot } from "@/utils/utools/NativeUtil";
import { useSnowflake } from "@/hooks/Snowflake";
import { useChatStore } from "@/store/components/ChatStore";
import { ChatAttachment, ChatAttachmentType } from "@/types/Chat";
import { useUtoolsKvStorage } from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import MessageUtil from "@/utils/modal/MessageUtil";

const emit = defineEmits(["ask"]);

const question = ref("");
const model = useUtoolsKvStorage(LocalNameEnum.KEY_HOME_MODEL, "");
const attachments = ref(new Array<ChatAttachment>());

const error = ref(false);

const attachmentVisible = computed(() => attachments.value.length > 0);
const loading = computed(() => useChatStore().loading);

function screenShot() {
  getScreenShot().then((res) => {
    // TODO: 临时存储附件
    attachments.value.push({
      id: useSnowflake().nextId(),
      type: ChatAttachmentType.IMAGE,
      file: res,
      name: "截图",
    });
  });
}

function deleteAttachment(id: string) {
  attachments.value = attachments.value.filter((item) => item.id !== id);
}

function ask() {
  if (isEmptyString(question.value)) {
    error.value = true;
    setTimeout(() => (error.value = false), 2000);
    return;
  }
  useChatStore()
    .ask({
      question: question.value,
      assistantId: model.value,
      attachments: attachments.value,
    })
    .then(() => {
      question.value = "";
      attachments.value = [];
      error.value = false;
    })
    .catch((e) => {
      MessageUtil.error("提问失败", e);
    });
}
</script>
<style scoped lang="less">
.ai-input {
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  padding: 8px;
  transition: border-color 0.3s;
  background-color: var(--color-bg-1);
  min-width: 616px;

  &:hover {
    border: 1px solid var(--color-border-3);
  }

  .attachment {
    width: 100%;
    display: flex;

    .attachment-item {
      width: 100px;
      height: 50px;
      overflow: hidden;
      object-fit: cover;
      position: relative;
      margin-right: 4px;
      border: 1px solid var(--color-border-1);
      border-radius: var(--border-radius-medium);
      transition: border-color 0.3s;

      &:hover {
        border: 1px solid var(--color-border-3);

        .close {
          opacity: 1;
        }
      }

      .close {
        position: absolute;
        top: 4px;
        right: 4px;
        opacity: 0;
        transition: opacity 0.3s;
        cursor: pointer;
      }

      .attachment-item__image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .input {
    display: flex;

    input[type="text"] {
      border: none;
      outline: none;
      width: 100%;
      background-color: var(--color-bg-1);
      color: var(--color-text-1);
    }
  }
}
</style>
