<template>
  <t-layout class="news-list w-full h-full">
    <t-aside class="news-list-aside" :width="newsSideCollapse ? '0px' : '232px'">
      <t-header class="news-list__header flex p-4 justify-between h-32px">
        <t-input class="flex-1 ml-4px" placeholder="请输入资讯名称" v-if="!newsSideCollapse"></t-input>
        <t-dropdown class="shrink-0 ml-4px" :options="options" v-if="!newsSideCollapse">
          <t-button theme="primary" shape="square">
            <template #icon>
              <plus-icon/>
            </template>
          </t-button>
        </t-dropdown>
      </t-header>
      <t-content class="h-full" @click="changeNewsKey('')">
        <div class="menu w-full h-full" ref="el">
          <div v-for="n in news" class="menu-item" :key="n.id"
               :class="{active: n.id === newsActiveKey}"
               @click.stop="changeNewsKey(n.id)" @contextmenu="onContextmenu($event, n)">
            <div class="menu-item-icon">
              <t-avatar :image="n.icon" :key="n.id">{{ n.name.slice(0, 1) }}</t-avatar>
            </div>
            <div class="menu-item-text ellipsis" v-show="!newsSideCollapse">{{ n.name }}</div>
            <div class="menu-item-move" v-show="!newsSideCollapse">
              <move-icon/>
            </div>
          </div>
        </div>
      </t-content>
    </t-aside>
    <t-content class="news-list-content">
      <router-view v-if="show"/>
      <div class="empty" v-else>
        <div class="empty-c">
          <t-empty title="请在左侧选择资讯" description="前往资讯广场订阅资讯"/>
        </div>
      </div>
      <div class="news-list-collapse" :style="{left: newsSideCollapse ? '-12px' : '-24px'}">
        <t-button theme="primary" variant="outline" shape="circle" size="small" @click="toggleCollapse()">
          <template #icon>
            <chevron-right-icon v-if="newsSideCollapse" />
            <chevron-left-icon v-else />
          </template>
        </t-button>
      </div>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import {useSortable} from "@vueuse/integrations/useSortable";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoveIcon,
  PlusIcon
} from "tdesign-icons-vue-next";
import {postNews} from "@/pages/news/components/NewsPost";
import {NewsIndex} from "@/entity/news";
import {useGlobalStore} from "@/store/GlobalStore";
import {newsActiveKey, newsSideCollapse, useNewsStore} from "@/store/db/NewsStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

const router = useRouter();

const options = [
  {
    content: '新增',
    onClick: () => postNews()
  }, {
    content: '导入'
  }, {
    content: '广场'
  }
];

const el = ref();

const show = computed(() => isNotEmptyString(newsActiveKey.value));
const news = computed(() => useNewsStore().news.filter(n => !!n));
const width = computed(() => `calc(100vw - ${48 + 1 + (newsSideCollapse.value ? 48 : 232)}px)`);

useSortable(el, news, {
  animation: 300,
  handle: '.menu-item',
  onEnd(e) {
    const {oldIndex = 0, newIndex = 0} = e;
    // 变成顺序
    nextTick(() => {
      // moveArrayElement(news.value, oldIndex, newIndex);
      useNewsStore().changeOrder(oldIndex, newIndex);
    })
  }
})

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

const toggleCollapse = useToggle(newsSideCollapse);

function onContextmenu(e: MouseEvent, idx: NewsIndex) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default-dark' : 'default',
    items: [
      {
        label: '编辑',
        onClick: () => {
          postNews(idx)
        }
      }, {
        label: h('div', {
          style: {
            color: 'var(--td-error-color)',
          }
        }, "删除"),
        onClick: () => {
          MessageBoxUtil.confirm('确定删除该资讯吗？', '删除', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
          }).then(() => {
            useNewsStore().deleteNews(idx.id)
              .then(() => MessageUtil.success("删除成功"))
              .catch(e => MessageUtil.error("删除失败", e));
          }).catch(() => {
          });
        }
      }
    ],
  })
}
</script>
<style scoped lang="less">
.empty {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.news-list {
  .news-list-aside {
    border-right: 1px solid var(--td-border-level-1-color);
    overflow: hidden;

    .news-list__header {
      border-bottom: 1px solid var(--td-border-level-1-color);
    }
  }

  .news-list-content {
    width: v-bind(width);
    position: relative;

    .news-list-collapse {
      transition: color .3s var(--n-bezier), right .3s var(--n-bezier), left .3s var(--n-bezier), border-color .3s var(--n-bezier), background-color .3s var(--n-bezier);
      cursor: pointer;
      position: absolute;
      top: 35%;
      transform: translateX(50%) translateY(-50%);
      z-index: 1;
    }
  }
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
    border-radius: var(--td-radius-default);
    display: grid;
    grid-template-columns: 32px 1fr 16px;
    overflow: hidden;

    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }

    &.active {
      background-color: var(--td-bg-color-container-active);
    }

    .menu-item-icon {
      width: 32px;
      height: 32px;
    }


    .menu-item-text {
      margin-left: 8px;
    }

    .menu-item-move {
      align-items: center;
    }
  }
}
</style>
