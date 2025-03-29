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
    <welcome-guide/>
    <article-interpretation v-model="aiVisible"/>
    <intelligent-writing v-model="iwVisible"/>
  </div>
</template>
<script lang="ts" setup>
import AiInput from "@/pages/home/components/AiInput.vue";
import WelcomeGuide from "@/pages/home/welcome/WelcomeGuide.vue";
import ArticleInterpretation from "@/pages/home/modal/ArticleInterpretation.vue";
import IntelligentWriting from "@/pages/home/modal/IntelligentWriting.vue";

const aiVisible = ref(false);
const iwVisible = ref(false);

// 文档解读
const article = () => aiVisible.value = true;
const write = () => iwVisible.value = true;

</script>
<style scoped lang="less">
.home-welcome {
  display: grid;
  place-items: center; /* 使内容在水平和垂直方向上都居中 */
  height: 100vh; /* 使容器占满整个视口高度 */

  .home-welcome-container {
    max-width: 600px;
    width: 100%;
    margin-top: -48px;

    .line1 {
      color: var(--td-text-color-primary);
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
          color: var(--td-brand-color);
          background-color: var(--td-brand-color-light);
        }

        .module-item-name {
          text-align: center;
          margin-top: 8px;
        }
      }
    }
  }

  .home-welcome-header {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
  }
}

</style>
