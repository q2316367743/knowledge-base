<template>
  <t-layout class="news-list w-full h-full">
    <t-aside class="news-list-aside" :width="newsSideCollapse ? '0px' : '232px'">
      <t-header class="flex p-4 justify-between h-32px">
        <t-input class="w-184px" placeholder="请输入资讯名称"></t-input>
        <t-dropdown :options="options">
          <t-button theme="primary" shape="square">
            <template #icon>
              <plus-icon/>
            </template>
          </t-button>
        </t-dropdown>
      </t-header>
      <t-content class="h-full" @click="changeNewsKey('')">
        <div class="menu w-full h-full">
          <div v-for="n in news" class="menu-item"
               :class="{active: n.id === newsActiveKey}"
               @click.stop="changeNewsKey(n.id)">
            <div class="menu-item-icon">
              <t-avatar :image="n.icon" :key="n.id">{{ n.name.slice(0, 1) }}</t-avatar>
            </div>
            <div class="menu-item-text">{{ n.name }}</div>
            <div class="menu-item-move">
              <move-icon/>
            </div>
          </div>
        </div>
      </t-content>
    </t-aside>
    <t-content>
      <router-view v-if="show"/>
      <div class="empty" v-else>
        <div class="empty-c">
          <t-empty title="请在左侧选择资讯" description="前往资讯广场订阅资讯"/>
        </div>
      </div>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import {newsActiveKey, newsSideCollapse, useNewsStore} from "@/store/db/NewsStore";
import {MoveIcon, PlusIcon} from "tdesign-icons-vue-next";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";
import {addNews} from "@/pages/news/components/NewsPost";

const router = useRouter();

const options = [{
  content: '新增',
  onClick: () => addNews()
}, {
  content: '导入'
}, {
  content: '广场'
}]

const show = computed(() => isNotEmptyString(newsActiveKey.value));
const news = computed(() => useNewsStore().news);
watch(newsActiveKey, val => {
  if (val === '') {
    router.push('/news')
  } else {
    router.push('/news/item/' + val)
  }
});

function changeNewsKey(res: string) {
  newsActiveKey.value = res;
}
</script>
<style scoped lang="less">
.empty {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.news-list-aside {
  border-right: 1px solid var(--td-border-level-1-color);
  overflow: hidden;
}

.menu {
  background-color: var(--td-bg-color-container);
  overflow: auto;

  .menu-item {
    cursor: pointer;
    transition: background-color 0.3s;
    width: calc(100% - 16px);
    padding: 4px;
    height: 32px;
    margin: 4px;
    align-items: center;
    border: 1px solid var(--td-border-level-1-color);
    border-radius: var(--td-radius-default);
    display: grid;
    grid-template-columns: 32px 1fr 16px;

    &:hover {
      background-color: var(--td-bg-color-container-hover);
      border: 1px solid var(--td-border-level-2-color);
    }

    &.active {
      background-color: var(--td-bg-color-container-active);
      border: 1px solid var(--td-border-level-2-color);
    }

    .menu-item-text {
      margin-left: 8px;
    }
  }
}
</style>
