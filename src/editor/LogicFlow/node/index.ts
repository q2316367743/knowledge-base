import LogicFlow from '@logicflow/core';
// 基础图形
import baseNodes from './basic';
// path绘制的个性化图形
import pathNodes from './path';
// 多边形绘制的箭头
import arrowNodes from './arrow';
// 注册边
import edges from './edge'
// 流程图注册
import lctNodes from './lct';

import {DiagramGroup, DiagramNode} from "./data/DiagramNode";

export * from './data/basic';

export async function registerCustomElement(lf: LogicFlow): Promise<DiagramGroup[]> {
    const diagramGroups: DiagramGroup[] = [];
    // 注册基础节点
    diagramGroups.push(registerNodes(lf, baseNodes, "basic-node", "基础节点"));
    // 注册path绘制的个性化图形
    diagramGroups.push(registerNodes(lf, pathNodes, "graph-node", "基础图形"));
    // 注册多边形绘制的箭头
    diagramGroups.push(registerNodes(lf, arrowNodes, "polygon-node", "箭头"));
    // 注册流程图
    diagramGroups.push(registerNodes(lf, lctNodes, "lct", "流程图"));
    // 注册image绘制图片节点
    // diagramGroups.push(registerNodes(lf, imageNodes, "image-node", "图片节点"));
    // 注册image绘制左上角icon节点
    // diagramGroups.push(registerNodes(lf, iconNodes, "icon-node", "图标节点"));
    // 注册边
    edges.forEach(edge => lf.register(edge));
    return Promise.resolve(diagramGroups);
}

function registerNodes(lf: LogicFlow, nodes: Array<any>, key: string, name: string): DiagramGroup {
    const diagramNodes = new Array<DiagramNode>()
    nodes.forEach(node => {
        lf.register(node);
        diagramNodes.push({
            name: node.type,
            icon: 'icon-' + node.type,
            tip: node.tip
        })
    });
    return {
        key,
        name,
        nodes: diagramNodes
    }
}

