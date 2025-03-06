import {API} from "@editorjs/editorjs";

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
}

export function buildKanbanData(): KanbanData {
  const now = Date.now()
  return {
    groups: [
      {
      id: '1',
      name: '待开始',
      color: '#70000D',
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
      color: '#00346B',
      nodes: []
    }
    ],
    height: 450,
    title: '看板'
  }
}

interface IKanbanInstance {
  data: Ref<KanbanData>;
  move: (oldGroupId: string, oldNodeId: string, newGroupId: string, newIndex: number) => void;
  api: API
}


export const KanbanInstance = Symbol() as InjectionKey<IKanbanInstance>;