<template>
  <div class="app-side">
    <t-menu class="h-full" breakpoint="xl" v-model="selectedKey" @change="onMenuItemClick" :collapsed="true">
      <t-menu-item value="/home" v-if="moduleForAi">
        <template #icon>
          <questionnaire-icon size="12px"/>
        </template>
        问一问
      </t-menu-item>
      <t-menu-item value="/news" v-if="moduleForNews && !disabledForModule">
        <template #icon>
          <article-icon/>
        </template>
        资讯
      </t-menu-item>
      <t-menu-item value="/note">
        <template #icon>
          <edit2-icon/>
        </template>
        笔记
      </t-menu-item>
      <t-menu-item value="/todo">
        <template #icon>
          <check-rectangle-icon/>
        </template>
        待办
      </t-menu-item>
      <t-submenu value="/tool">
        <template #icon>
          <tools-icon/>
        </template>
        <template #title>工具</template>
        <t-menu-item value="/tool/search">
          搜索内容
        </t-menu-item>
        <t-menu-item value="/tool/recycle">
          回收站
        </t-menu-item>
        <t-menu-item value="/tool/category">
          分类图
        </t-menu-item>
        <t-menu-item value="/plugin">
          主题|插件|模板
        </t-menu-item>
      </t-submenu>
      <t-submenu value="/setting">
        <template #icon>
          <setting-icon/>
        </template>
        <template #title>设置</template>
        <t-menu-item value="/setting/base">
          基础设置
        </t-menu-item>
        <t-menu-item value="/setting/code-run">
          代码运行设置
        </t-menu-item>
        <t-menu-item value="/setting/ai-service">
          AI 服务设置
        </t-menu-item>
        <t-menu-item value="/setting/ai-assistant">
          AI 助手设置
        </t-menu-item>
        <t-menu-item value="/setting/feature">
          关键字设置
        </t-menu-item>
      </t-submenu>
      <t-submenu value="/more">
        <template #icon>
          <ellipsis-icon/>
        </template>
        <template #title>更多</template>
        <t-menu-item value="/more/backup" v-if="isUtools">
          备份
        </t-menu-item>
        <t-menu-item value="/more/attachment" v-if="isUtools">
          附件
        </t-menu-item>
        <t-menu-item value="/more/recommend">
          推荐
        </t-menu-item>
        <t-menu-item value="/more/update">
          更新
        </t-menu-item>
        <t-menu-item value="/more/about">
          关于
        </t-menu-item>
      </t-submenu>
    </t-menu>
    <div class="app-exit">
      <t-dropdown position="tl" trigger="click">
        <t-button theme="primary" variant="text" shape="square" style="margin-bottom: 7px;">
          <template #icon>
            <moon-icon v-if="themeType === GlobalType.DARK"/>
            <sunny-icon v-else-if="themeType === GlobalType.LIGHT"/>
            <fill-color-icon v-else/>
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="useGlobalStore().switchDarkColors(GlobalType.DARK)">
            <template #prefix-icon>
              <moon-icon/>
            </template>
            暗黑
          </t-dropdown-item>
          <t-dropdown-item @click="useGlobalStore().switchDarkColors(GlobalType.LIGHT)">
            <template #prefix-icon>
              <sunny-icon/>
            </template>
            明亮
          </t-dropdown-item>
          <t-dropdown-item @click="useGlobalStore().switchDarkColors(GlobalType.AUTO)">
            跟随系统
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-dropdown placement="top-left" trigger="click">
        <t-button theme="primary" variant="text" shape="square" style="margin-bottom: 7px;">
          <template #icon>
            <questionnaire-icon/>
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="openKeyDrawer()">
            <template #prefix-icon>
              <keyboard-icon/>
            </template>
            快捷键
          </t-dropdown-item>
          <t-dropdown-item @click="toDoc()">
            <template #prefix-icon>
              <questionnaire-icon/>
            </template>
            帮助中心
          </t-dropdown-item>
          <t-dropdown-item @click="toFeedback()">
            <template #prefix-icon>
              <chat-message-icon/>
            </template>
            反馈与建议
          </t-dropdown-item>
          <t-dropdown-item @click="toUpdateLog()">
            <template #prefix-icon>
              <system-messages-icon/>
            </template>
            更新日志
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-button theme="primary" variant="text" shape="square" @click="userVipToggle()">
        <template #icon>
          <user-vip-icon/>
        </template>
      </t-button>
    </div>
    <user-vip-drawer v-model="userVipVisible"/>
  </div>
</template>
<script lang="ts" setup>
import {
  ArticleIcon, ChatMessageIcon,
  CheckRectangleIcon,
  Edit2Icon, EllipsisIcon, FillColorIcon, KeyboardIcon, MoonIcon,
  QuestionnaireIcon,
  SettingIcon, SunnyIcon, SystemMessagesIcon,
  ToolsIcon, UserVipIcon
} from "tdesign-icons-vue-next";
import {openKeyDrawer} from "@/components/app-side/func";
import {GlobalType, useGlobalStore} from "@/store/GlobalStore";
import {moduleForAi, moduleForNews} from "@/store/ModuleStore";
import {toDoc, toFeedback} from "@/global/Constant";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const route = useRoute();
const router = useRouter();
const disabledForModule = !InjectionUtil.env.isSupportMarkdown();
const isUtools = InjectionUtil.env.isUtools();

const selectedKey = ref('/note');

const themeType = computed(() => useGlobalStore().globalType);

watch(() => route.path, path => {
  if (selectedKey.value !== path) {
    if (path.startsWith("/news")) {
      selectedKey.value = '/news';
    } else {
      selectedKey.value = path;
    }
  }
});

const toUpdateLog = () => router.push('/more/update')

function onMenuItemClick(value: string | number) {
  router.push(`${value}`)
}

const userVipVisible = ref(false);
const userVipToggle = useToggle(userVipVisible);
</script>
<style scoped lang="less">
.app-side {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.t-menu) {
    padding: 4px;

    .t-menu__item {
      padding: 0 4px !important;
      width: 40px !important;
    }
  }

  .app-exit {
    position: absolute;
    left: 8px;
    bottom: 8px;
  }
}
</style>
