<template>
  <t-layout class="more">
    <t-aside v-if="max" class="more-aside">
      <t-menu v-model="activeKey" @change="handleClick">
        <t-menu-item value="/more/backup" v-if="isUtools">备份</t-menu-item>
        <t-menu-item value="/more/attachment" v-if="isUtools">附件</t-menu-item>
        <t-menu-item value="/more/recommend">推荐</t-menu-item>
        <t-menu-item value="/more/update">更新</t-menu-item>
        <t-menu-item value="/more/about">关于</t-menu-item>
      </t-menu>
    </t-aside>
    <t-header v-else>
      <t-tabs v-model="activeKey" @change="handleClick">
        <t-tab-panel value="/more/backup" label="备份" v-if="isUtools"/>
        <t-tab-panel value="/more/attachment" label="附件" v-if="isUtools"/>
        <t-tab-panel value="/more/recommend" label="推荐"/>
        <t-tab-panel value="/more/update" label="更新"/>
        <t-tab-panel value="/more/about" label="关于"/>
      </t-tabs>
    </t-header>
    <t-content class="main">
      <router-view/>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const route = useRoute();
const router = useRouter();
const size = useWindowSize();

const isUtools = InjectionUtil.env.isUtools();

const activeKey = ref(route.path);
const max = computed(() => size.width.value > 960);

const handleClick = (v: any) => {
  router.push(v);
};
</script>
<style scoped lang="less">
.more {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .more-aside {
    border-right: 1px solid var(--td-border-level-2-color);
  }

  .main {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: var(--td-bg-color-container);
  }
}
</style>
