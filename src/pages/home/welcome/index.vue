<template>
  <div class="home-welcome">
    <div class="home-welcome-container">
      <div class="line1">
        知识库
      </div>
      <div class="line2">
        构建属于你自己的知识库
      </div>
      <a-tooltip :popup-visible="error" content="问题不能为空" position="tl">
        <div class="line3">
          <div class="attachment" v-if="attachmentVisible">
            <div class="attachment-item" v-for="item in attachments" :key="item.id">
              <a-image class="attachment-item__image" v-if="item.type === HomeAttachmentType.IMAGE" :src="item.file"
                       :alt="item.name" width="100px" height="50px"/>
              <div class="close" @click="deleteAttachment(item.id)">
                <icon-delete style="color: rgb(var(--danger-6))"/>
              </div>
            </div>
          </div>
          <a-divider :margin="8" v-if="attachmentVisible"/>
          <div class="input">
            <input v-model="question" type="text" placeholder="提出你的问题，回车提问" @keydown.enter="ask()"/>
            <div class="module-select">
              <ai-module v-model="model" />
            </div>
            <a-divider direction="vertical" :margin="8"/>
            <a-dropdown>
              <a-tooltip content="文件数量：最多支持10个">
                <a-button type="text">
                  <template #icon>
                    <icon-attachment/>
                  </template>
                </a-button>
              </a-tooltip>
              <template #content>
                <a-doption>
                  <template #icon>
                    <icon-file/>
                  </template>
                  本地文件
                </a-doption>
                <a-doption>
                  <template #icon>
                    <icon-edit/>
                  </template>
                  笔记文件
                </a-doption>
              </template>
            </a-dropdown>
            <a-tooltip content="截图回答，支持图片识别等">
              <a-button type="text" @click="screenShot">
                <template #icon>
                  <icon-screenshot style="fill: rgb(var(--arcoblue-6))"/>
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </a-tooltip>
      <div class="line4">
        <div class="module-item" @click="article">
          <div class="module-item-icon">
            <icon-file :size="24"/>
          </div>
          <div class="module-item-name">
            文档解读
          </div>
        </div>
        <div class="module-item" @click="write">
          <div class="module-item-icon">
            <icon-file :size="24"/>
          </div>
          <div class="module-item-name">
            智能写作
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import IconScreenshot from "@/icon/IconScreenshot.vue";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {HomeAttachment, HomeAttachmentType} from "@/pages/home/welcome/types";
import {getScreenShot} from "@/utils/utools/NativeUtil";
import {useSnowflake} from "@/hooks/Snowflake";

const router = useRouter();
// 问题
const question = ref('');
const model = ref('');
const attachments = ref(new Array<HomeAttachment>())

const error = ref(false);

const attachmentVisible = computed(() => attachments.value.length > 0);

// 文档解读
const article = () => MessageUtil.warning("暂未实现");
const write = () => MessageUtil.warning("暂未实现");

function screenShot() {
  getScreenShot().then(res => {
    attachments.value.push({
      id: useSnowflake().nextId(),
      type: HomeAttachmentType.IMAGE,
      file: res,
      name: '截图'
    })
  })
}

function deleteAttachment(id: string) {
  attachments.value = attachments.value.filter(item => item.id !== id);
}

function ask() {
  if (isEmptyString(question.value)) {
    error.value = true;
    setTimeout(() => error.value = false, 2000);
    return;
  }
  // TODO: 临时存储附件
  // 跳转
  router.push({
    path: '/home/chat',
    query: {
      question: question.value,
      model: model.value,
    }
  })
}
</script>
<style scoped lang="less">
.home-welcome {
  display: grid;
  place-items: center; /* 使内容在水平和垂直方向上都居中 */
  height: 100vh; /* 使容器占满整个视口高度 */
  background-color: var(--color-fill-1);

  .home-welcome-container {
    max-width: 600px;
    width: 100%;

    .line1 {
      color: var(--color-text-1);
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
    }

    .line2 {
      color: var(--color-text-2);
      text-align: center;
      margin-top: 16px;
    }

    .line3 {
      width: calc(100% - 2px);
      margin-top: 32px;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-medium);
      padding: 8px;
      transition: border-color 0.3s;
      background-color: var(--color-bg-1);

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

        input[type=text] {
          border: none;
          outline: none;
          width: 397px;
          background-color: var(--color-bg-1);
          color: var(--color-text-1);
        }

        .module-select {
          width: 120px;
          text-align: right;
          overflow: hidden;
        }
      }

    }

    .line4 {
      margin-top: 32px;
      display: flex;
      justify-content: center;
      align-items: center;

      .module-item {
        padding: 16px;
        cursor: pointer;
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }

        .module-item-icon {
          padding: 16px;
          border-radius: 50%;
          background-color: var(--color-fill-3);
        }

        .module-item-name {
          text-align: center;
          margin-top: 8px;
        }
      }
    }
  }
}

</style>
