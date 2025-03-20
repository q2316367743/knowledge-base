<template>
  <div class="app-side">
    <t-menu class="h-full" breakpoint="xl" v-model="selectedKey" @change="onMenuItemClick" :collapsed="true">
      <t-menu-item value="/home" v-if="moduleForAi">
        <template #icon>
          <questionnaire-icon size="12px" />
        </template>
        问一问
      </t-menu-item>
      <t-menu-item value="/news" v-if="moduleForNews">
        <template #icon>
          <article-icon/>
        </template>
        资讯
      </t-menu-item>
      <t-menu-item value="/note">
        <template #icon>
          <edit2-icon />
        </template>
        笔记
      </t-menu-item>
      <t-menu-item value="/todo">
        <template #icon>
          <check-rectangle-icon />
        </template>
        待办
      </t-menu-item>
      <t-submenu value="/tool">
        <template #icon>
          <tools-icon  />
        </template>
        <template #title>工具</template>
        <t-menu-item value="/tool/search">
          <template #icon>
            <search-icon />
          </template>
          搜索内容
        </t-menu-item>
        <t-menu-item value="/tool/recycle">
          <template #icon>
            <delete-icon />
          </template>
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
          <setting-icon />
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
          <ellipsis-icon />
        </template>
        <template #title>更多</template>
        <t-menu-item value="/more/backup">
          <template #icon>
            <refresh-icon />
          </template>
          备份
        </t-menu-item>
        <t-menu-item value="/more/attachment">
          <template #icon>
            <file-attachment-icon />
          </template>
          附件
        </t-menu-item>
        <t-menu-item value="/more/recommend">
          <template #icon>
            <thumb-up-icon />
          </template>
          推荐
        </t-menu-item>
        <t-menu-item value="/more/update">
          <template #icon>
            <history-icon />
          </template>
          更新
        </t-menu-item>
        <t-menu-item value="/more/about">
          <template #icon>
            <info-circle-icon />
          </template>
          关于
        </t-menu-item>
      </t-submenu>
    </t-menu>
    <div class="app-exit">
      <t-dropdown position="tl" trigger="click">
        <t-button theme="primary" variant="text" shape="square" style="margin-bottom: 7px;">
          <template #icon>
            <icon-moon v-if="themeType === GlobalType.DARK"/>
            <icon-sun v-else-if="themeType === GlobalType.LIGHT"/>
            <icon-palette v-else/>
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="useGlobalStore().switchDarkColors(GlobalType.DARK)">
            <template #icon>
              <icon-moon/>
            </template>
            暗黑
          </t-dropdown-item>
          <t-dropdown-item @click="useGlobalStore().switchDarkColors(GlobalType.LIGHT)">
            <template #icon>
              <icon-sun/>
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
            <icon-question-circle/>
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="openKeyDrawer()">
            <template #prefix-icon>
              <icon-to-bottom/>
            </template>
            快捷键
          </t-dropdown-item>
          <t-dropdown-item @click="toDoc()">
            <template #prefix-icon>
              <icon-question-circle/>
            </template>
            帮助中心
          </t-dropdown-item>
          <t-dropdown-item @click="toFeedback()">
            <template #prefix-icon>
              <icon-message/>
            </template>
            反馈与建议
          </t-dropdown-item>
          <t-dropdown-item @click="toUpdateLog()">
            <template #prefix-icon>
              <icon-message-banned/>
            </template>
            查看更新日志
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-button theme="primary" variant="text" shape="square" @click="openShangZan()">
        <template #icon>
          <icon-heart/>
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ArticleIcon,
  CheckRectangleIcon, DeleteIcon,
  Edit2Icon, EllipsisIcon, FileAttachmentIcon, HistoryIcon, InfoCircleIcon,
  QuestionnaireIcon, RefreshIcon,
  SearchIcon, SettingIcon, ThumbUpIcon,
  ToolsIcon
} from "tdesign-icons-vue-next";
import {GlobalType, useGlobalStore} from "@/store/GlobalStore";
import {openKeyDrawer, openShangZan} from "@/components/app-side/func";
import {toDoc, toFeedback} from "@/global/Constant";
import {moduleForAi, moduleForNews} from "@/store/ModuleStore";

const route = useRoute();
const router = useRouter();

const selectedKey = ref('/note');

const themeType = computed(() => useGlobalStore().globalType)

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
