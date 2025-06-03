<template>
  <div class="welcome-container">

    <div class="welcome-collapse">
      <t-button theme="primary" variant="text" shape="square" @click="toggleCollapsed()" v-if="collapsed">
        <template #icon>
          <menu-fold-icon/>
        </template>
      </t-button>
    </div>

    <div class="welcome-content">
      <div class="welcome-logo">
        <logo-github-icon size="48px" class="welcome-logo-icon"/>
        <h1 class="welcome-title">问一问</h1>
      </div>

      <div class="welcome-greeting">
        <p>Hi, 欢迎使用 问一问</p>
      </div>

      <div class="welcome-description">
        <p>问一问 可以帮助您写文章、回答问题、提供灵感。请尊重知识产权。</p>
        <p>作为AI模型，问一问 提供的答案可能不总是准确的，但我们会尽力提供帮助。</p>
      </div>

    </div>

    <div class="welcome-input">
      <div class="suggested-questions">
        <span class="question-tag">最近你在做什么项目？</span>
        <span class="question-tag">帮我写一个快速指南</span>
        <span class="question-tag">使用 AI 帮助写作</span>
      </div>

      <div class="input-container">
        <chat-sender
          v-model="text"
          class="chat-sender"
          :textarea-props="{placeholder: '请输入消息...',}"
          @send="inputEnter"
        >
          <template #suffix>
            <t-space size="small">
              <t-button variant="outline" shape="round" :disabled @click="onClear">
                <template #icon>
                  <delete-icon/>
                </template>
                清空输入
              </t-button>
              <t-button shape="round" :disabled @click="onSend">发送</t-button>
            </t-space>
          </template>
          <template #prefix>
            <home-assistant-select v-model="model"/>
          </template>
        </chat-sender>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ChatIcon, DeleteIcon, HelpCircleIcon, LogoGithubIcon, MenuFoldIcon, StarIcon} from "tdesign-icons-vue-next";
import {ChatSender} from '@tdesign-vue-next/chat';
import {activeKey, collapsed, toggleCollapsed} from "@/pages/home/model";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useAiChatListStore} from "@/store/ai/AiChatListStore";
import MessageUtil from "@/utils/modal/MessageUtil";

const text = ref('');
const model = useUtoolsKvStorage<string>(LocalNameEnum.KEY_HOME_MODEL, '');

const disabled = computed(() => text.value.trim() === '');

const onClear = () => text.value = '';
const onSend = () => {
  if (disabled.value) {
    return;
  }
  inputEnter(text.value);
  text.value = '';
};
// 模拟消息发送
const inputEnter = (inputValue: string) => {
  // 添加到列表中
  useAiChatListStore()
    .post('0', inputValue, model.value, [])
    .then(id => activeKey.value = `/home/chat/0/${id}`)
    .catch(e => MessageUtil.error("提问失败", e));

};

</script>
<style scoped lang="less">
.welcome-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  padding: 16px;
  box-sizing: border-box;

  .welcome-collapse {
    position: absolute;
    top: 8px;
    left: 8px;
  }
}

.welcome-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 16px;

  .welcome-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;

    .welcome-logo-icon {
      color: var(--td-brand-color);
      margin-bottom: 8px;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
  }

  .welcome-greeting {
    margin-bottom: 16px;
    font-size: 16px;
  }

  .welcome-description {
    margin-bottom: 32px;
    color: var(--td-text-color-secondary);
    font-size: 14px;
    max-width: 600px;

    p {
      margin: 8px 0;
    }
  }

  .welcome-features {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    width: 100%;
    max-width: 800px;

    .feature-item {
      flex: 1;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background-color: var(--td-bg-color-container-hover);
      padding: 16px;
      border-radius: var(--td-radius-medium);
      cursor: pointer;
      transition: background-color 0.3s;
      text-align: left;

      &:hover {
        background-color: var(--td-bg-color-container-active);
      }

      .feature-icon {
        color: var(--td-brand-color);
        font-size: 24px;
      }

      .feature-content {
        flex: 1;

        .feature-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .feature-desc {
          font-size: 12px;
          color: var(--td-text-color-secondary);
        }
      }
    }
  }
}

.welcome-input {
  margin-top: auto;
  width: 100%;

  .suggested-questions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;

    .question-tag {
      background-color: var(--td-bg-color-container-hover);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--td-bg-color-container-active);
      }
    }
  }

}
</style>
