import MindMap from "simple-mind-map";
import Ctx from '@imengyu/vue3-context-menu';
import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {useGlobalStore} from "@/store";

export function handleNodeContextmenu(e: PointerEvent, node: MindMapNode, mindMap: MindMap) {
  Ctx.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items: [{
      label: "插入同级节点",
      onClick: () => {
        if (!node.isRoot && !node.isGeneralization) {
          mindMap.execCommand('INSERT_NODE');
        }
      }
    }, {
      label: '插入子级节点',
      onClick: () => {
        if (!node.isGeneralization) {
          mindMap.execCommand('INSERT_CHILD_NODE');
        }
      }
    }, {
      label: '插入父级节点',
      onClick: () => {
        if (node.isRoot && !node.isGeneralization) {
          mindMap.execCommand('INSERT_PARENT_NODE');
        }
      }
    }, {
      label: () => <div style={{color: 'var(--td-error-color)'}}>删除节点</div>,
      onClick: () => {
        mindMap.execCommand('REMOVE_NODE');
      }
    }, {
      label: '插入概要',
      onClick: () => {
        if (!node.isRoot && !node.isGeneralization) {
          mindMap.execCommand('ADD_GENERALIZATION');
        }
      }
    }, {
      label: '插入关联线',
      onClick: () => {
        if (!node.isRoot && !node.isGeneralization) {
          // @ts-ignore
          mindMap.associativeLine.createLineFromActiveNode();
        }
      }
    }, {
      label: '复制',
      onClick: () => {
        mindMap.renderer.copy();
      }
    }, {
      label: '剪贴',
      onClick: () => {
        mindMap.renderer.cut();
      }
    }, {
      label: '黏贴',
      onClick: () => {
        mindMap.renderer.paste();
      }
    }]
  })
}