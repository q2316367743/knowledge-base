<template>
  <div class="kanban-node" v-if="node" @click="onClick" @contextmenu="onContextmenu">
    <div class="kanban-node-title">
      {{ node.name }}
    </div>
    <t-paragraph :ellipsis="ellipsisState" class="kanban-node-remark" v-if="showRemark && content">
      {{ content }}
    </t-paragraph>
  </div>
</template>
<script lang="tsx" setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import {ArrowDownIcon, ArrowUpIcon, DeleteIcon, EditIcon, InfoCircleIcon} from 'tdesign-icons-vue-next';
import {IKanbanInstance, KanbanDataNode, KanbanInstance} from "@/editor/SuperEditor/tools/KanbanTool/types";
import {useGlobalStore} from "@/store/GlobalStore";
import {openKanbanNodePost} from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanNodePost";
import {openKanbanNodeInfo} from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanNodeInfo";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

const props = defineProps({
  node: {
    type: Object as PropType<KanbanDataNode>,
    required: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  idx: {
    type: Number,
    default: 0
  },
  groupId: {
    type: String,
    default: ''
  }
});

const instance = inject<IKanbanInstance>(KanbanInstance);

const ellipsisState = ref({
  row: 3,
  expandable: false,
  collapsible: false,
});

const parser = new DOMParser();

function removeHtmlTag(html: string) {
  return parser.parseFromString(html, "text/html").body.textContent
}


const showRemark = computed(() => instance?.data.value.showRemark);
const content = computed(() => {
  if (!props.node) return '';
  return removeHtmlTag(props.node.content);
});

function onClick() {
  if (props.readOnly) return;
  openKanbanNodeInfo(props.node);
}

function onContextmenu(e: MouseEvent) {
  if (props.readOnly) return;
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default-dark' : 'default',
    items: [
      {
        label: '向上插入记录',
        icon: () => <ArrowUpIcon/>,
        onClick: () => {
          openKanbanNodePost(props.groupId, undefined, instance, props.idx)
        }
      }, {
        label: '向下插入记录',
        icon: () => <ArrowDownIcon/>,
        onClick: () => {
          openKanbanNodePost(props.groupId, undefined, instance, props.idx + 1)
        }
      }, {
        divided: 'self'
      }, {
        label: '查看记录',
        icon: () => <InfoCircleIcon/>,
        onClick: () => {
          openKanbanNodeInfo(props.node);
        }
      }, {
        label: '编辑记录',
        icon: () => <EditIcon/>,
        onClick: () => {
          openKanbanNodePost(props.groupId, props.node, instance);
        }
      }, {
        label: '删除记录',
        icon: () => <DeleteIcon/>,
        onClick: () => {
          if (!instance) return MessageUtil.error("系统异常，核心注入器不存在");
          MessageBoxUtil.confirm("是否删除此记录，删除后无法恢复", "删除记录", {
            confirmButtonText: "删除"
          }).then(() => {
            try {
              instance.deleteNode(props.groupId, props.node.id);
              MessageUtil.success("删除成功");
            } catch (e) {
              MessageUtil.error("删除失败", e)
            }
          });
        }
      }
    ],
  })
}
</script>
<style scoped lang="less">
.kanban-node {
  padding: 16px 12px;
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--td-radius-medium);
  cursor: pointer;
  margin-top: 8px;
  background-color: var(--td-bg-color-container);
  transition: all 0.3s;

  &:hover {
    border-color: var(--td-border-level-2-color);
    background-color: var(--td-bg-color-container-hover);
  }

  .kanban-node-remark {
    color: var(--td-text-color-secondary) !important;
    font-size: var(--td-font-size-body-small) !important;
    margin: 0;
  }
}
</style>
