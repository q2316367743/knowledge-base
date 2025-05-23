import {LogicFlowOption} from "@/editor/LogicFlow/components/LogicFlowOption";

export const shortStyles = [
    {
        backgroundColor: 'rgb(255, 255, 255)',
        borderWidth: 1,
        borderColor: 'rgb(42, 42, 42)'
    },
    {
        backgroundColor: 'rgb(245, 245, 245)',
        borderWidth: 1,
        borderColor: 'rgb(102, 102, 102)'
    },
    {
        backgroundColor: 'rgb(218, 232, 252)',
        borderWidth: 1,
        borderColor: 'rgb(108, 142, 191)'
    },
    {
        backgroundColor: 'rgb(213, 232, 212)',
        borderWidth: 1,
        borderColor: 'rgb(130, 179, 102)'
    },
    {
        backgroundColor: 'rgb(255, 230, 204)',
        borderWidth: 1,
        borderColor: 'rgb(215, 155, 0)'
    },
    {
        backgroundColor: 'rgb(255, 242, 204)',
        borderWidth: 1,
        borderColor: 'rgb(214, 182, 86)'
    },
    {
        backgroundColor: 'rgb(248, 206, 204)',
        borderWidth: 1,
        borderColor: 'rgb(184, 84, 80)'
    },
    {
        backgroundColor: 'rgb(220, 210, 230)',
        borderWidth: 1,
        borderColor: 'rgb(150, 115, 166)'
    }
]

export const borderStyles = [
    {
        value: 'solid'
    },
    {
        value: 'dashed'
    },
    {
        value: 'dotted'
    }
]

export const fontFamilies = ['微软雅黑'];

// 静默模式
export const silentConfig = {
    stopZoomGraph: false,
    stopScrollGraph: false,
    stopMoveGraph: false,
    adjustEdge: false,
    adjustEdgeStartAndEnd: false,
    adjustNodePosition: false,
    hideAnchors: true,
    nodeSelectedOutline: true,
    nodeTextEdit: false,
    edgeTextEdit: false,
    nodeTextDraggable: false,
    edgeTextDraggable: false,
};

// 正常模式
export const originalConfig = {
    stopZoomGraph: true,
    stopScrollGraph: true,
    stopMoveGraph: true,
    adjustEdge: true,
    adjustEdgeStartAndEnd: true,
    adjustNodePosition: true,
    hideAnchors: false,
    nodeSelectedOutline: false,
    nodeTextEdit: true,
    edgeTextEdit: true,
    nodeTextDraggable: true,
    edgeTextDraggable: true,
};


export interface LogicFlowData {
  data: LogicFlowDataData;
  option: LogicFlowOption;
  editConfig: Record<string, any>;
  config?: Record<string, any>;
}

export interface LogicFlowDataData {
  nodes: LogicFlowDataNode[];
  edges: LogicFlowDataEdge[];
}

interface LogicFlowDataEdge {
  id: string;
  type: string;
  properties: Record<string, any>;
  sourceNodeId: string;
  targetNodeId: string;
  startPoint: StartPoint;
  endPoint: StartPoint;
  pointsList: StartPoint[];
}

interface StartPoint {
  x: number;
  y: number;
}


interface LogicFlowDataNode {
  id: string;
  type: string;
  x: number;
  y: number;
  properties: Properties;
  text?: Text;
}

interface Text {
  x: number;
  y: number;
  value: string;
}

interface Properties {
  backgroundColor?: string;
  borderType?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  textAlign?: string;
  fontStyle?: string;
  textDecoration?: string;
}


export function buildLogicFlowData(miniMap = true): LogicFlowData {
  return {
    data: {
      "nodes": [
        {
          "id": "387d7ca1-a582-4e2e-bf51-a056dbd70783",
          "type": "pro-rect",
          "x": 36,
          "y": 89,
          "properties": {
            "backgroundColor": "#ffffff",
            "borderType": 0,
            "borderColor": "",
            "borderWidth": 2,
            "borderStyle": "solid",
            "fontSize": 12,
            "fontColor": "#000000",
            "fontWeight": "",
            "fontFamily": "",
            "lineHeight": "1",
            "textAlign": "center",
            "fontStyle": "",
            "textDecoration": ""
          },
          "text": {
            "x": 36,
            "y": 89,
            "value": "你好"
          }
        },
        {
          "id": "3f32b304-4e84-4fe4-9375-48e3ada0c80b",
          "type": "pro-circle",
          "x": 296,
          "y": 89,
          "properties": {}
        }
      ],
      "edges": [
        {
          "id": "3992994d-0ce9-456a-8bd0-e2ae3db4c0ac",
          "type": "pro-polyline",
          "properties": {},
          "sourceNodeId": "387d7ca1-a582-4e2e-bf51-a056dbd70783",
          "targetNodeId": "3f32b304-4e84-4fe4-9375-48e3ada0c80b",
          "startPoint": {
            "x": 86,
            "y": 89
          },
          "endPoint": {
            "x": 246,
            "y": 89
          },
          "pointsList": [
            {
              "x": 86,
              "y": 89
            },
            {
              "x": 246,
              "y": 89
            }
          ]
        }
      ]
    },
    option: {
      miniMap,
      grid: 'empty',
      gridSize: 0,
      gridVisible: false,
      gridConfigColor: '#000000',
      gridConfigThickness: 1
    },
    editConfig: {
      stopZoomGraph: false,
      stopScrollGraph: false,
      stopMoveGraph: false,
      adjustEdge: true,
      adjustEdgeMiddle: false,
      adjustEdgeStartAndEnd: false,
      adjustNodePosition: true,
      hideAnchors: false,
      hoverOutline: true,
      nodeSelectedOutline: true,
      edgeSelectedOutline: true,
      nodeTextEdit: true,
      edgeTextEdit: true,
      textEdit: true,
      nodeTextDraggable: false,
      edgeTextDraggable: false,
      autoExpand: true
    }
  }
}