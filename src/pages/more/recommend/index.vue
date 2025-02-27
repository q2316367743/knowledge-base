<template>
  <page-layout title="推荐">
    <t-list :bordered="false">
      <!-- 听雨HTML转Markdown -->
      <t-list-item action-layout="vertical">
        <template #action>
          <t-space>
            <t-link target="_blank" theme="primary"
                    @click="openLink('https://gitee.com/qiaoshengda/rain-html-to-markdown')">Gitee仓库
            </t-link>
            <t-link @click="toApp('网页剪报')" theme="primary">立即使用</t-link>
          </t-space>
        </template>
        <t-list-item-meta title="网页剪报" :image="RainHtmlToMarkdown"
                          description="快速将Html转Markdown，可以实现网页文章转存知识库">
        </t-list-item-meta>
      </t-list-item>
      <!-- 卡片笔记 -->
      <t-list-item action-layout="vertical">
        <template #action>
          <t-space>
            <t-link target="_blank" theme="primary"
                    @click="openLink('https://gitee.com/qiaoshengda/card-note')">Gitee仓库
            </t-link>
            <t-link @click="toApp('卡片笔记')" theme="primary">立即使用</t-link>
          </t-space>
        </template>
        <t-list-item-meta title="卡片笔记" :image="CardNote"
                          description="卡片笔记是一种用于记录和存储信息的文本文件，它可以帮助人们记录重要的想法、日志、备忘录或其他内容。">
        </t-list-item-meta>
      </t-list-item>
      <!-- 代码管家 -->
      <t-list-item action-layout="vertical">
        <template #action>
          <t-link @click="toApp('代码管家')" theme="primary">立即使用</t-link>
        </template>
        <t-list-item-meta title="代码管家" description="代码管家包含了[模板解析DDL]【代码片段生成】
                        [模板解析Jso][本地Mock管理]【代码笔记】【模板解析Exc】等功能，代码管家是通过编写代码模板，
                        生成各种自定义代码文本，可实现重复代码快速生成，避免重复操作，自由度很高的代码生成器。"
        :image="Dmgj" />
      </t-list-item>
      <!-- 听雨图编辑器 -->
      <t-list-item action-layout="vertical">
        <template #action>
          <t-space>
            <t-link @click="openLink('https://gitee.com/qiaoshengda/rain-graph')" theme="primary">Gitee</t-link>
            <t-link @click="toApp('听雨图编辑器')" theme="primary">立即使用</t-link>
          </t-space>
        </template>
        <t-list-item-meta title="听雨图编辑器" :image="UToolsMusic"
                          description="支持流程图、思维导图、白板。支持画板、可视化图表、二维码生成。支持图片裁剪" />
      </t-list-item>
      <!-- es-client -->
      <t-list-item action-layout="vertical">
        <template #action>
          <t-space>
            <t-link target="_blank" theme="primary" @click="openLink('http://es-client.esion.xyz')">官网</t-link>
            <t-link target="_blank" theme="primary"
                    @click="openLink('https://gitee.com/qiaoshengda/es-client')">Gitee仓库
            </t-link>
            <t-link target="_blank" theme="primary"
                    @click="openLink('https://github.com/q2316367743/es-client')">GitHub仓库
            </t-link>
            <t-link @click="toApp('es-client')" theme="primary">立即使用</t-link>
          </t-space>
        </template>
        <t-list-item-meta :image="EsClient"
          description="es-client是一款elasticsearch客户端，界面美观，可以实现链接管理，索引管理，基础搜索，高级搜索等功能">
          <template #title>
            <t-space>
              <b>es-client</b>
              <img src='https://gitee.com/qiaoshengda/es-client/badge/star.svg?theme=white'
                       alt='gitee star' />
              <img
                src="https://img.shields.io/github/stars/q2316367743/es-client?style=social"
                alt="github star"/>
            </t-space>
          </template>
        </t-list-item-meta>
      </t-list-item>
    </t-list>
  </page-layout>
</template>
<script lang="ts" setup>
import {useUmami} from "@/plugin/umami";
import RainHtmlToMarkdown from '@/assets/logo/rain-html-to-markdown.png';
import CardNote  from '@/assets/logo/card-note.png';
import Dmgj from '@/assets/logo/dmgj.png';
import UToolsMusic from '@/assets/logo/rain-graph.png';
import EsClient from '@/assets/logo/es-client.png';

// TODO: 此处需要样式优化
function openLink(url: string) {
  utools.shellOpenExternal(url);
}

function toApp(name: string) {
  useUmami.track(`/推荐/${name}`);
  utools.redirect([name, name], '');
}
</script>
<style lang="less">
</style>
