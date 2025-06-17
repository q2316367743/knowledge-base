<template>
  <div class="app-side">
    <t-menu class="h-full" breakpoint="xl" v-model="selectedKey" @change="onMenuItemClick" :collapsed="appCollapsed">
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
      </t-submenu>
      <t-menu-item value="/setting">
        <template #icon>
          <setting-icon/>
        </template>
        设置
      </t-menu-item>
      <t-menu-item value="/more">
        <template #icon>
          <ellipsis-icon/>
        </template>
        更多
      </t-menu-item>
      <template #logo>
        <div class="flex items-center justify-center" :class="{'w-full': appCollapsed}" style="margin-left: 0">
          <t-dropdown placement="bottom-left" trigger="click">
            <img :width="35" :src="profile.avatar" :alt="profile.nickname" :title="profile.nickname"
                 class="cursor-pointer"/>
            <t-dropdown-menu>
              <t-dropdown-item divider>
                <template #prefix-icon>
                  <moon-icon v-if="themeType === GlobalType.DARK"/>
                  <sunny-icon v-else-if="themeType === GlobalType.LIGHT"/>
                  <fill-color-icon v-else/>
                </template>
                主题
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
              </t-dropdown-item>
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
              <t-dropdown-item divider @click="toUpdateLog()">
                <template #prefix-icon>
                  <system-messages-icon/>
                </template>
                更新日志
              </t-dropdown-item>
              <t-dropdown-item @click="userVipToggle()">
                <template #prefix-icon>
                  <user-vip-icon/>
                </template>
                个人中心
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
          <template v-if="!appCollapsed">
            <span class="title ml-16px">知识库</span>
            <span class="version">{{ Constant.version }}</span>
          </template>
        </div>
      </template>
      <template #operations>
        <t-button theme="primary" variant="text" shape="square" size="large" @click="useAppCollapsed()">
          <template #icon>
            <view-list-icon/>
          </template>
        </t-button>
      </template>
    </t-menu>
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
  ToolsIcon, UserVipIcon, ViewListIcon
} from "tdesign-icons-vue-next";
import {openKeyDrawer} from "@/components/app-side/func";
import {appCollapsed, GlobalType, useAppCollapsed, useGlobalStore} from "@/store/GlobalStore";
import {moduleForAi, moduleForNews} from "@/store/ModuleStore";
import Constant, {toDoc, toFeedback} from "@/global/Constant";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useUserStore} from "@/store/components/UserStore";

const route = useRoute();
const router = useRouter();
const disabledForModule = !InjectionUtil.env.isSupportMarkdown();

const selectedKey = ref('/note');

const themeType = computed(() => useGlobalStore().globalType);
const profile = computed(() => useUserStore().profile);

watch(() => route.path, path => {
  if (selectedKey.value !== path) {
    if (path.startsWith("/news")) {
      selectedKey.value = '/news';
    } else if (path.startsWith("/setting")) {
      selectedKey.value = '/setting';
    } else if (path.startsWith("/more")) {
      selectedKey.value = '/more';
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

  .title {
    font-size: var(--td-font-size-title-large);
    font-weight: bold;
    user-select: none;
  }

  .version {
    font-size: var(--td-font-size-body-small);
    margin-left: 6px;
    padding-top: 6px;
  }

}
</style>
