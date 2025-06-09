<template>
  <t-drawer v-model:visible="visible" :footer="false" :header="false" size="400px" attach="body">
    <div class="user-vip-drawer">
      <t-card v-if="isUtools">
        <div class="user-info">
          <t-avatar :image="user.avatar" size="large"/>
          <div class="user-name">{{ user.nickname }}</div>
        </div>
        <t-divider/>
        <div class="vip-info">
          <div class="vip-features flex">
            <div class="feature-item">
              <div class="feature-item-header">uTools会员</div>
              <div class="feature-item-content">
                <div v-if="user.type === 'member'" class="feature-item-content__success">已开通</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-item-header">
                <span>笔记会员</span>
                <t-link theme="primary" variant="text" shape="square" class="ml-4px" size="small"
                        @click="openNoteVipWebsite">
                  <questionnaire-icon/>
                </t-link>
              </div>
              <div class="feature-item-content">
                <t-link v-if="noteNoVip" class="feature-item-content__error" @click="openVip('note')">去开通</t-link>
                <div v-else class="feature-item-content__success">永久授权</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-item-header">
                <span>待办会员</span>
                <t-link theme="primary" variant="text" shape="square" class="ml-4px" size="small"
                        @click="openTodoVipWebsite">
                  <questionnaire-icon/>
                </t-link>
              </div>
              <div class="feature-item-content">
                <t-link v-if="todoNoVip" class="feature-item-content__error" @click="openVip('todo')"
                        :disabled="true">
                  去开通
                </t-link>
                <div v-else class="feature-item-content__success">永久授权</div>
              </div>
            </div>
          </div>
        </div>
      </t-card>
      <t-card v-else>
        <div class="flex justify-between items-center">
          <div class="web-info">
            <t-avatar :image="user.avatar" size="56px"/>
            <div class="web-info-user">
              <div class="user-name">{{ user.nickname }}</div>
              <div class="user-rename">
                <t-button size="small" variant="outline" theme="primary" @click="rename()">重命名</t-button>
              </div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item-header">
              <span>笔记会员</span>
              <t-link theme="primary" variant="text" shape="square" class="ml-4px" size="small"
                      @click="openNoteVipWebsite">
                <questionnaire-icon/>
              </t-link>
            </div>
            <div class="feature-item-content">
              <t-link v-if="noteNoVip" class="feature-item-content__error" @click="openVip('note')">去开通</t-link>
              <div v-else class="feature-item-content__success">永久授权</div>
            </div>
          </div>
        </div>
      </t-card>
      <t-card class="help-info">
        <t-collapse :borderless="true" :expand-mutex="true">
          <t-collapse-panel header="🌟 核心亮点">
            <ul class="pl-24px m-0">
              <li>多模态笔记整合：支持富文本、Markdown、代码、表格、思维导图、流程图六大创作模式</li>
              <li>代码笔记直接运行：支持50+语言高亮，内置代码执行引擎，实时调试脚本无需切出界面</li>
              <li>智能剪藏功能：借助插件uTools能力，一键将网络文章转换为Markdown格式并保存到知识库</li>
              <li>全局搜索与回收站：快速定位笔记内容，误删文件也能轻松恢复</li>
              <li>AI智能助手：基于笔记内容快速提问，获取精准答案</li>
            </ul>
          </t-collapse-panel>
          <t-collapse-panel header="📚 笔记功能">
            <ul class="pl-24px m-0">
              <li>多富文本笔记：支持图文混排、字体样式、段落格式等</li>
              <li>Markdown笔记：简洁高效的写作体验，支持实时预览</li>
              <li>代码笔记：支持代码高亮与直接运行，方便管理脚本</li>
              <li>表格笔记：快速创建结构化数据，支持基础计算</li>
              <li>思维导图：可视化梳理思路，节点自由拖拽</li>
              <li>流程图：简单易用的流程图绘制工具</li>
            </ul>
          </t-collapse-panel>
          <t-collapse-panel header="✅ 待办功能">
            <ul class="pl-24px m-0">
              <li>支持多种布局：默认列表、看板（Kanban）、日历视图</li>
              <li>简洁高效：快速添加、编辑任务，支持任务状态标记</li>
              <li>智能提醒：重要事项不再遗漏</li>
            </ul>
          </t-collapse-panel>
          <t-collapse-panel header="🍿 笔记会员">
            <ul class="pl-24px m-0">
              <li>超级笔记：个笔记即可整合富文本、Markdown、代码、表格、思维导图、流程图六大模式，打破创作边界</li>
              <li>加密笔记：通过aes-256-cbc进行加密，保护您的数据安全</li>
              <li>闪卡：快速记住知识点，你的学习好帮手</li>
            </ul>
          </t-collapse-panel>
          <t-collapse-panel header="🚀 待办会员" v-if="isUtools">
            <ul class="pl-24px m-0">
              <li>待办小部件：随时查看待办任务</li>
            </ul>
          </t-collapse-panel>
        </t-collapse>
      </t-card>
      <t-card title="更多">
        <t-space size="small">
          <t-button @click="openKeyDrawer">
            <template #icon>
              <keyboard-icon/>
            </template>
            快捷键
          </t-button>
          <t-button @click="toFeedback">
            <template #icon>
              <chat-message-icon/>
            </template>
            问题反馈
          </t-button>
          <t-button @click="openShangZan">
            <template #icon>
              <heart-icon/>
            </template>
            赏赞
          </t-button>
        </t-space>
      </t-card>
    </div>
  </t-drawer>
</template>
<script lang="ts" setup>
import {ChatMessageIcon, HeartIcon, KeyboardIcon, QuestionnaireIcon} from "tdesign-icons-vue-next";
import {useVipStore} from "@/store";
import {openKeyDrawer, openShangZan} from "@/components/app-side/func";
import {openNoteVipWebsite, openTodoVipWebsite, toFeedback} from "@/global/Constant";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useUserStore} from "@/store/components/UserStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

const visible = defineModel({
  type: Boolean,
  default: false
});
const isUtools = InjectionUtil.getPlatform() === 'uTools';

// TODO: 不是uTools的会员功能
const user = computed(() => useUserStore().profile);
const noteNoVip = computed(() => useVipStore().noteNoVip);
const todoNoVip = computed(() => useVipStore().todoNoVip);

const {openVip} = useVipStore();

const rename = () => {
  MessageBoxUtil.prompt("请输入新的昵称", "修改昵称", {
    inputValue: user.value.nickname
  })
    .then(name => useUserStore().rename(name))
}
</script>
<style scoped lang="less">
.user-vip-drawer {
  display: flex;
  flex-direction: column;
  gap: var(--td-comp-margin-s);

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .user-name {
      font-size: 18px;
      font-weight: 500;
      color: var(--td-brand-color);
    }
  }

  .web-info {
    display: flex;

    .web-info-user {
      margin-left: 8px;

      .user-name {
        font-size: 18px;
        font-weight: 500;
        color: var(--td-brand-color);
      }

      .user-rename {
        margin-top: 8px;
      }
    }
  }

  .feature-item {
    font-size: 14px;
    text-align: center;

    .feature-item-header {
      font-weight: 500;
      font-size: var(--td-font-size-title-small);
      color: var(--td-text-color-secondary);
    }

    .feature-item-content {
      font-size: var(--td-font-size-body-large);
      margin-top: var(--td-comp-margin-m);

      :deep(.t-link) {
        font-size: var(--td-font-size-body-large);
      }
    }

    .feature-item-content__success {
      color: var(--td-success-color);
    }

    .feature-item-content__error {
      color: var(--td-error-color);
    }
  }

  .vip-info {
    display: flex;
    flex-direction: column;

    .vip-features {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .help-info {
    :deep(.t-card__body) {
      padding: 2px;
    }
  }
}
</style>
