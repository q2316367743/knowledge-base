<template>
  <a-menu style="width: 200px;height: 100%;" breakpoint="xl" v-model:selected-keys="selectedKeys">
    <a-menu-item key="/home">
      <template #icon>
        <icon-home/>
      </template>
      主页
    </a-menu-item>
    <a-menu-item key="/note">
      <template #icon>
        <icon-edit/>
      </template>
      笔记
    </a-menu-item>
    <a-menu-item key="/todo">
      <template #icon>
        <icon-check-square/>
      </template>
      待办
    </a-menu-item>
    <a-sub-menu key="/tool">
      <template #icon>
        <icon-tool/>
      </template>
      <a-menu-item key="/tool/search">
        <template #icon>
          <icon-search/>
        </template>
        搜索内容
      </a-menu-item>
      <template #title>工具</template>
      <a-menu-item key="/tool/recycle">
        回收站
      </a-menu-item>
      <a-menu-item key="/tool/category">
        分类图
      </a-menu-item>
      <a-menu-item key="/plugin">
        主题|插件|模板
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="/setting">
      <template #icon>
        <icon-settings/>
      </template>
      <template #title>设置</template>
      <a-menu-item key="/setting/base">
        基础设置
      </a-menu-item>
      <a-menu-item key="/setting/code-run">
        代码运行设置
      </a-menu-item>
      <a-menu-item key="/setting/ai-service">
        AI 服务设置
      </a-menu-item>
      <a-menu-item key="/setting/ai-assistant">
        AI 助手设置
      </a-menu-item>
      <a-menu-item key="/setting/feature" v-if="isUtools">
        关键字设置
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="/more">
      <template #icon>
        <icon-more/>
      </template>
      <template #title>更多</template>
      <a-menu-item key="/more/backup">
        <template #icon>
          <icon-sync/>
        </template>
        备份
      </a-menu-item>
      <a-menu-item key="/more/attachment" v-if="isUtools">
        <template #icon>
          <icon-attachment/>
        </template>
        附件
      </a-menu-item>
      <a-menu-item key="/more/recommend">
        <template #icon>
          <icon-thumb-up/>
        </template>
        推荐
      </a-menu-item>
      <a-menu-item key="/more/update">
        <template #icon>
          <icon-time-line/>
        </template>
        更新
      </a-menu-item>
      <a-menu-item key="/more/about">
        <template #icon>
          <icon-exclamation-circle/>
        </template>
        关于
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
  <div class="app-exit">
    <a-dropdown position="tl">
      <a-button type="text" style="margin-bottom: 7px;">
        <template #icon>
          <icon-moon v-if="themeType === GlobalType.DARK"/>
          <icon-sun v-else-if="themeType === GlobalType.LIGHT"/>
          <icon-palette v-else/>
        </template>
      </a-button>
      <template #content>
        <a-doption @click="useGlobalStore().switchDarkColors(GlobalType.DARK)">
          <template #icon>
            <icon-moon/>
          </template>
          暗黑
        </a-doption>
        <a-doption @click="useGlobalStore().switchDarkColors(GlobalType.LIGHT)">
          <template #icon>
            <icon-sun/>
          </template>
          明亮
        </a-doption>
        <a-doption @click="useGlobalStore().switchDarkColors(GlobalType.AUTO)">
          跟随系统
        </a-doption>
      </template>
    </a-dropdown>
    <a-dropdown position="tl">
      <a-button type="text" style="margin-bottom: 7px;">
        <template #icon>
          <icon-question-circle/>
        </template>
      </a-button>
      <template #content>
        <a-doption @click="openKeyDrawer()">
          <template #icon>
            <icon-to-bottom/>
          </template>
          快捷键
        </a-doption>
        <a-doption @click="toDoc()">
          <template #icon>
            <icon-question-circle/>
          </template>
          帮助中心
        </a-doption>
        <a-doption @click="toFeedback()">
          <template #icon>
            <icon-message/>
          </template>
          反馈与建议
        </a-doption>
        <a-doption @click="toUpdateLog()">
          <template #icon>
            <icon-message-banned/>
          </template>
          查看更新日志
        </a-doption>
      </template>
    </a-dropdown>
    <a-button type="text" @click="openShangZan()">
      <template #icon>
        <icon-heart/>
      </template>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import IconTimeLine from "@/icon/IconTimeLine.vue";
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {GlobalType, useGlobalStore} from "@/store/GlobalStore";
import {isUtools} from "@/global/BeanFactory";
import {openKeyDrawer, openShangZan} from "@/components/app-side/func";
import {toDoc, toFeedback} from "@/global/Constant";

const route = useRoute();
const router = useRouter();

const selectedKeys = ref(['/home']);

const themeType = computed(() => useGlobalStore().globalType)

watch(() => selectedKeys.value, value => router.push(value[0]));
watch(() => route.path, path => {
  if (selectedKeys.value[0] !== path) {
    selectedKeys.value[0] = path;
  }
});

const toUpdateLog = () => router.push('/more/update')

</script>
<style scoped>
.app-exit {
  position: absolute;
  left: 8px;
  bottom: 8px;
}
</style>
