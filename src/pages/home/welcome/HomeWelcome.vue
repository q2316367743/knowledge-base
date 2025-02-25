<template>
  <div class="home-welcome">
    <div class="home-welcome-container">
      <div class="line1">
        知识库
      </div>
      <div class="line2">
        构建属于你自己的知识库
      </div>
      <div class="line3">
        <ai-input/>
      </div>
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
    <div class="home-welcome-extra">
      <a-space>
        <home-assistant-select width="360px"/>
        <a-dropdown position="br">
          <a-button type="outline" class="home-welcome-setting">
            <template #icon>
              <icon-settings/>
            </template>
          </a-button>
          <template #content>
            <a-doption @click="aiService">AI 服务</a-doption>
            <a-doption @click="aiAssistant">AI 助手</a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </div>
    <welcome-guide/>
    <article-interpretation v-model="aiVisible"/>
    <intelligent-writing v-model="iwVisible" />
  </div>
</template>
<script lang="ts" setup>
import AiInput from "@/pages/home/components/AiInput.vue";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import WelcomeGuide from "@/pages/home/welcome/WelcomeGuide.vue";
import ArticleInterpretation from "@/pages/home/modal/ArticleInterpretation.vue";
import IntelligentWriting from "@/pages/home/modal/IntelligentWriting.vue";

const router = useRouter();

const aiVisible = ref(false);
const iwVisible = ref(false);

// 文档解读
const article = () => aiVisible.value = true;
const write = () => iwVisible.value = true;
const aiService = () => router.push("/setting/ai-service");
const aiAssistant = () => router.push("/setting/ai-assistant");

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
      margin-top: 32px;
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

  .home-welcome-extra {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

</style>
