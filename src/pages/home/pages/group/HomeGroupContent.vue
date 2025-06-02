<template>
  <div class="home-group-content" v-if="group">
    <div class="home-group-content-title">
      <div class="home-group-content-title-left">
        <div class="home-group-content-title-left-icon">
          <folder-icon size="32px"/>
        </div>
        <div class="home-group-content-title-left-name">
          {{ group.name }}
        </div>
      </div>
      <div class="home-group-content-title-right">
        <t-space size="small">
          <t-input placeholder="搜索组内对话">
            <template #prefix-icon>
              <search-icon/>
            </template>
          </t-input>
          <t-dropdown trigger="click">
            <t-button theme="primary" shape="square">
              <template #icon>
                <more-icon/>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item>编辑名称</t-dropdown-item>
              <t-dropdown-item style="color: var(--td-error-color)">删除分组</t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </t-space>
      </div>
    </div>
    <t-row :gutter="16">
      <t-col flex="auto">
        <div class="home-group-content-prompt" @click="visible = !visible">
          <div class="main">
            <div class="home-group-content-prompt__title">{{ hasPrompt ? "工作指令" : "添加指令" }}</div>
            <div class="home-group-content-prompt__content ellipsis" v-if="hasPrompt">{{ group.prompt }}</div>
            <div class="home-group-content-prompt__placeholder" v-else>定制问一问在该分组的回答方式</div>
          </div>
          <div class="icon">
            <chevron-right-icon size="20px" class="mt-15px"/>
          </div>
        </div>
      </t-col>
      <t-col flex="72px" v-if="!hasPrompt" class="home-group-content-prompt center">
        指令库
      </t-col>
    </t-row>
    <t-dialog v-model:visible="visible" header="编辑指令" draggable width="500px" confirm-btn="使用"
              @confirm="onConfirm">
      <t-textarea v-model="group.prompt" placeholder="请输入指令" :autosize="{minRows: 8, maxRows: 8}"/>
      <t-space class="mt-16px">
        <span>指令参考</span>
        <t-link theme="primary">地道翻译大师</t-link>
        <t-link theme="primary">占卜师</t-link>
        <t-link theme="primary">代码专家</t-link>
        <span> | </span>
        <t-link theme="primary">
          <span>更多</span>
          <template #suffix-icon>
            <chevron-right-icon/>
          </template>
        </t-link>
      </t-space>
    </t-dialog>
  </div>
</template>
<script lang="ts" setup>
import {ChevronRightIcon, FolderIcon, MoreIcon, SearchIcon} from "tdesign-icons-vue-next";
import {buildAiChatGroupWrap} from "@/entity/ai/AiChat";
import {useAiChatGroupStore} from "@/store/ai/AiChatGroupStore";
import MessageUtil from "@/utils/modal/MessageUtil";

const props = defineProps({
  groupId: {
    type: String,
    default: '0'
  }
});

const group = ref(buildAiChatGroupWrap());
const visible = ref(false);


const hasPrompt = computed(() => !!group.value.prompt);

onMounted(() => {
  // 获取
  useAiChatGroupStore().getById(props.groupId)
    .then(g => group.value = g)
    .catch(e => MessageUtil.error("获取分组失败", e));
});

const onConfirm = () => {

}
</script>
<style scoped lang="less">
.home-group-content {
  max-width: 752px;
  padding: 0 24px;
  margin: 0 auto;

  .home-group-content-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .home-group-content-title-left {
      display: flex;
      align-items: center;

      .home-group-content-title-left-name {
        font-size: var(--td-font-size-title-large);
        margin-left: 8px;
      }
    }
  }

  .home-group-content-prompt {
    padding: 12px 16px;
    background-color: var(--td-bg-color-component);
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    transition: all .2s;
    display: flex;

    &:hover {
      background-color: var(--td-bg-color-component-hover);
    }

    &:active {
      background-color: var(--td-bg-color-component-active);
    }

    &.center {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 74px;
    }

    .main {
      width: calc(100% - 48px);
    }

    .icon {
      width: 32px;
      margin-left: 16px;
    }


    .home-group-content-prompt__title {
      font-size: var(--td-font-size-body-large);
    }

    .home-group-content-prompt__content {
      font-size: var(--td-font-size-body-medium);
      margin-top: 6px;
    }

    .home-group-content-prompt__placeholder {
      font-size: var(--td-font-size-body-medium);
      color: var(--td-text-color-placeholder);
      margin-top: 6px;
    }
  }
}
</style>
