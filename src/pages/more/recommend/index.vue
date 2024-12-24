<template>
  <div class="recommend">
    <a-scrollbar style="height:100%;overflow: auto;">
      <div class="recommend-wrapper">
        <a-list :bordered="false">
          <template #header>
            推荐
          </template>
          <!-- 听雨HTML转Markdown -->
          <a-list-item action-layout="vertical">
            <template #actions>
              <a-link target="_blank"
                      @click="openLink('https://gitee.com/qiaoshengda/rain-html-to-markdown')">Gitee仓库
              </a-link>
            </template>
            <template #extra>
              <a-link @click="toApp('网页剪报')" style="margin-top: 40px;">立即使用</a-link>
            </template>
            <a-list-item-meta title="网页剪报"
                              description="快速将Html转Markdown，可以实现网页文章转存知识库">
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="es-client" src="@/assets/logo/rain-html-to-markdown.png"/>
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <!-- 卡片笔记 -->
          <a-list-item action-layout="vertical">
            <template #actions>
              <a-link target="_blank"
                      @click="openLink('https://gitee.com/qiaoshengda/card-note')">Gitee仓库
              </a-link>
            </template>
            <template #extra>
              <a-link @click="toApp('卡片笔记')" style="margin-top: 40px;">立即使用</a-link>
            </template>
            <a-list-item-meta title="卡片笔记"
                              description="卡片笔记是一种用于记录和存储信息的文本文件，它可以帮助人们记录重要的想法、日志、备忘录或其他内容。">
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="es-client" src="@/assets/logo/card-note.png"/>
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <!-- 代码管家 -->
          <a-list-item action-layout="vertical">
            <template #extra>
              <a-link @click="toApp('代码管家')" style="margin-top: 40px;">立即使用</a-link>
            </template>
            <a-list-item-meta title="代码管家" description="代码管家包含了[模板解析DDL]【代码片段生成】
                        [模板解析Jso][本地Mock管理]【代码笔记】【模板解析Exc】等功能，代码管家是通过编写代码模板，
                        生成各种自定义代码文本，可实现重复代码快速生成，避免重复操作，自由度很高的代码生成器。">
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="代码管家" src="@/assets/logo/dmgj.png"/>
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <!-- 听雨图编辑器 -->
          <a-list-item action-layout="vertical">
            <template #actions>
              <a-link target="_blank"
                      @click="openLink('https://flowus.cn/esion/share/e600111c-48de-444a-99ee-6c6c4eebc24c')">
                官网
              </a-link>
              <a-link @click="openLink('https://gitee.com/qiaoshengda/rain-graph')">Gitee</a-link>
            </template>
            <template #extra>
              <a-link @click="toApp('听雨图编辑器')" style="margin-top: 40px;">立即使用</a-link>
            </template>
            <a-list-item-meta title="听雨图编辑器"
                              description="支持流程图、思维导图、白板。支持画板、可视化图表、二维码生成。支持图片裁剪">
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="听雨图编辑器" src="@/assets/logo/rain-graph.png"/>
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <!-- es-client -->
          <a-list-item action-layout="vertical">
            <template #actions>
              <a-link target="_blank" @click="openLink('http://es-client.esion.xyz')">官网</a-link>
              <a-link target="_blank"
                      @click="openLink('https://gitee.com/qiaoshengda/es-client')">Gitee仓库
              </a-link>
              <a-link target="_blank"
                      @click="openLink('https://github.com/q2316367743/es-client')">GitHub仓库
              </a-link>
            </template>
            <template #extra>
              <a-link @click="toApp('es-client')" style="margin-top: 40px;">立即使用</a-link>
            </template>
            <a-list-item-meta
              description="es-client是一款elasticsearch客户端，界面美观，可以实现链接管理，索引管理，基础搜索，高级搜索等功能">
              <template #title>
                <div style="display: flex;">
                  <b>es-client</b>
                  <a-image src='https://gitee.com/qiaoshengda/es-client/badge/star.svg?theme=white'
                           alt='gitee star'/>
                  <a-image
                    src="https://img.shields.io/github/stars/q2316367743/es-client?style=social"
                    alt="github star"/>
                </div>
              </template>
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="es-client" src="@/assets/logo/es-client.png"/>
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </a-scrollbar>
  </div>
</template>
<script lang="ts">
import {useUmami} from "@/plugin/umami";
import {defineComponent} from "vue";

// TODO: 此处需要样式优化
export default defineComponent({
  name: 'setting-recommend',
  data: () => ({}),
  methods: {
    openLink(url: string) {
      utools.shellOpenExternal(url);
    },
    toApp(name: string) {
      useUmami.track(`/推荐/${name}`);
      utools.redirect([name, name], '');
    }
  }
});
</script>
<style lang="less">
.recommend {
  & > .arco-scrollbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .scrollbar {
      overflow: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

    }
  }

  .arco-image {
    margin-left: 1em;
  }
}
</style>
