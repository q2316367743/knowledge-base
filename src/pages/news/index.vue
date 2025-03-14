<template>
  <t-layout class="news-list w-full h-full">
    <t-aside
      class="news-list-aside"
      :width="newsSideCollapse ? '0px' : '232px'"
    >
      <t-header class="news-list__header flex p-4 justify-between h-32px">
        <t-input
          class="flex-1 ml-4px"
          placeholder="请输入资讯名称"
          v-if="!newsSideCollapse"
        ></t-input>
        <t-dropdown
          class="shrink-0 ml-4px"
          :options="options"
          v-if="!newsSideCollapse"
        >
          <t-button theme="primary" shape="square">
            <template #icon>
              <plus-icon/>
            </template>
          </t-button>
        </t-dropdown>
      </t-header>
      <t-content class="h-full" @click="changeNewsKey('')">
        <div class="menu w-full h-full" ref="el">
          <div
            v-for="n in news"
            class="menu-item"
            :key="n.id"
            :class="{ active: n.id === newsActiveKey }"
            @click.stop="changeNewsKey(n.id)"
            @contextmenu="onContextmenu($event, n)"
          >
            <div class="menu-item-icon">
              <t-avatar :image="n.icon" :key="n.id">{{
                  n.name.slice(0, 1)
                }}
              </t-avatar>
            </div>
            <div class="menu-item-text ellipsis" v-show="!newsSideCollapse">
              {{ n.name }}
            </div>
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
          <t-empty
            title="请在左侧选择资讯"
            description="前往资讯广场订阅资讯"
          />
        </div>
      </div>
      <div :class="{ collapse: newsSideCollapse, 'news-list-collapse': true }">
        <t-button
          theme="primary"
          variant="outline"
          shape="circle"
          @click="toggleCollapse()"
        >
          <template #icon>
            <chevron-right-icon v-if="newsSideCollapse"/>
            <chevron-left-icon v-else/>
          </template>
        </t-button>
      </div>
    </t-content>
  </t-layout>
</template>
<script lang="tsx" setup>
import ContextMenu from "@imengyu/vue3-context-menu";
import {useSortable} from "@vueuse/integrations/useSortable";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoveIcon,
  PlusIcon,
} from "tdesign-icons-vue-next";
import {DeleteIcon, EditIcon} from 'tdesign-icons-vue-next';
import {postNews} from "@/pages/news/components/NewsPost";
import {NewsIndex} from "@/entity/news";
import {useGlobalStore} from "@/store/GlobalStore";
import {
  newsActiveKey,
  newsSideCollapse,
  useNewsStore,
} from "@/store/db/NewsStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isEmptyArray, isNotEmptyString} from "@/utils/lang/FieldUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

const router = useRouter();

const options = [
  {
    content: "新增",
    onClick: () => postNews(),
  }, {
    content: "广场",
    onClick: () => MessageUtil.warning("暂未实现")
  }, {
    content: "导入",
    onClick: () => {
      window.preload.customer.openFile({
        title: "选择资讯导出文件",
        filters: [{name: "JSON", extensions: ["json"]}],
        properties: ["openFile"],
        buttonLabel: "选择文件"
      }).then(files => {
        if (isEmptyArray(files)) return;
        const target = files[0];
        // 将file对象转为字符串
        const re = new FileReader();
        re.onload = () => {
          useNewsStore().importNews(re.result as string);
        }
        re.readAsText(target);
      })
    }
  }, {
    content: "导出",
    onClick: () => {
      useNewsStore().exportNews()
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e));
    }
  },
];

const el = ref();

const show = computed(() => isNotEmptyString(newsActiveKey.value));
const news = computed(() => useNewsStore().news.filter((n) => !!n));
const width = computed(() => `calc(100vw - ${48 + 1 + (newsSideCollapse.value ? 48 : 232)}px)`);

useSortable(el, news, {
  animation: 300,
  handle: ".menu-item",
  onEnd(e) {
    const {oldIndex = 0, newIndex = 0} = e;
    // 变成顺序
    nextTick(() => {
      // moveArrayElement(news.value, oldIndex, newIndex);
      useNewsStore().changeOrder(oldIndex, newIndex);
    });
  },
});

watch(newsActiveKey, (val) => {
  if (val === "") {
    router.push("/news");
  } else {
    router.push("/news/item/" + val);
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
    theme: useGlobalStore().isDark ? "default-dark" : "default",
    items: [
      {
        icon: () => <EditIcon/>,
        label: "编辑",
        onClick: () => {
          postNews(idx);
        },
      },
      {
        icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
        label: () => <div style={{color: 'var(--td-error-color)'}}>删除</div>,
        onClick: () => {
          MessageBoxUtil.confirm("确定删除该资讯吗？", "删除", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
          })
            .then(() => {
              useNewsStore()
                .deleteNews(idx.id)
                .then(() => MessageUtil.success("删除成功"))
                .catch((e) => MessageUtil.error("删除失败", e));
            })
            .catch(() => {
            });
        },
      },
    ],
  });
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
      transition: left 0.3s;
      cursor: pointer;
      position: absolute;
      top: 35%;
      transform: translateX(50%) translateY(-50%);
      z-index: 200;
      left: -32px;

      &.collapse {
        left: -32px;

        &:hover {
          left: -16px;
        }
      }
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
