import {API} from "@editorjs/editorjs";
import {useSnowflake} from "@/hooks/Snowflake";

export interface KanbanDataNode {
  id: string;
  created: number;
  name: string;
  content: string;
}

export interface KanbanDataGroup {
  id: string;
  name: string;
  color: string;
  nodes: Array<KanbanDataNode>
}

export interface KanbanData {
  groups: Array<KanbanDataGroup>;
  height: number;
  title: string;
  showRemark: boolean;
}

export function buildKanbanData(): KanbanData {
  const now = Date.now()
  return {
    groups: [
      {
        id: '1',
        name: '待开始',
        color: '#70000d',
        nodes: [{
          id: '1',
          created: now + 1,
          name: '任务1',
          content: ''
        }, {
          id: '2',
          created: now + 2,
          name: '任务2',
          content: ''
        }, {
          id: '3',
          created: now + 3,
          name: '任务3',
          content: ''
        }]
      }, {
        id: '2',
        name: '进行中',
        color: '#664900',
        nodes: []
      }, {
        id: '2',
        name: '已完成',
        color: '#00346b',
        nodes: []
      }
    ],
    height: 450,
    title: '看板',
    showRemark: false
  }
}

export function buildKanbanNode(): KanbanDataNode {
  return {
    id: useSnowflake().nextId(),
    created: Date.now(),
    name: '',
    content: ''
  }
}

export function buildKanbanGroup(): KanbanDataGroup {
  return {
    id: useSnowflake().nextId(),
    name: '',
    // 随机获取一个颜色
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    nodes: []
  }
}

export interface IKanbanInstance {
  api: API;
  data: Ref<KanbanData>;

  // 设置相关
  changeShowRemark: (value: boolean) => void;

  moveNode: (oldGroupId: string, oldNodeId: string, newGroupId: string, newIndex: number) => void;
  postNode: (groupId: string, node: KanbanDataNode, index?: number) => void;
  deleteNode: (groupId: string, nodeId: string) => void;

  addGroup: (name: string, color: string) => void;
  updateGroup: (groupId: string, name: string, color: string) => void;
  deleteGroup: (groupId: string) => void;
}


export const KanbanInstance = Symbol() as InjectionKey<IKanbanInstance>;