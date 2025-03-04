<template>
  <div class="about">
    <div class="container">
      <div class="logo">
        <img src="/logo.png" alt="知识库" style="width: 200px" draggable="false"/>
      </div>
      <div class="title">{{ Constant.name }} <span class="version">{{ Constant.version }}</span></div>
      <div class="author">
        <t-link :link="Constant.website" target="_blank" @click="openUrl(Constant.website)">
          {{ Constant.author }}
        </t-link>
      </div>
      <div class="desc">
        <p>构建属于自己的知识库。</p>
        <p>开通utools会员，数据可同步。</p>
      </div>
      <div class="action">
        <t-space>
          <t-button @click="openUrl(Constant.repo)">开源地址</t-button>
          <t-button @click="toFeedback()">反馈中心</t-button>
          <t-button @click="toUpdateLog()">更新日志</t-button>
        </t-space>
        <br/>
        <t-tooltip content="控制台">
          <t-switch :default-checked="consoleShow" @change="changeConsole()" style="margin-top: 14px;">
            <template #label="slotProps">{{ slotProps.value ? '显示' : '隐藏' }}</template>
          </t-switch>
        </t-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Constant, {toFeedback, toUpdateLog} from "@/global/Constant";
import {useErrorStore} from "@/store/components/ErrorStore";

const consoleShow = computed(() => useErrorStore().consoleShow);
const changeConsole = () => useErrorStore().changeConsole();

function openUrl(url: string) {
  utools.shellOpenExternal(url);
}


</script>
<style scoped lang="less">
.about {
  position: relative;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .logo {
    height: 200px;
  }

  .title {
    width: fit-content;
    font-size: 2em;
    background: linear-gradient(60deg, #e21143, #ffb03a);
    -webkit-background-clip: text;
    color: transparent;
    font-weight: bolder;
    margin: 28px auto 0;
    user-select: none;

    .version {
      font-size: 0.5em;
    }
  }

  .author {
    margin-top: 14px;
  }


  .desc {
    margin-top: 28px;
    user-select: none;
  }

  .action {
    margin-top: 28px;

    .arco-btn {
      margin: 0 7px;
    }
  }

}
</style>
