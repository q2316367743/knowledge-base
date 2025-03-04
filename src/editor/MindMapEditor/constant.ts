//  主题列表
import {MindMapTreeData, MindMapTreeNode} from "@/editor/MindMapEditor/domain";

export const themeList = [
    {
        name: '默认',
        value: 'default',
        dark: false
    },
    {
        name: '暗色2',
        value: 'dark2',
        dark: true
    },
    {
        name: '天清绿',
        value: 'skyGreen',
        dark: false
    },
    {
        name: '脑图经典2',
        value: 'classic2',
        dark: false
    },
    {
        name: '脑图经典3',
        value: 'classic3',
        dark: false
    },
    {
        name: '经典绿',
        value: 'classicGreen',
        dark: false
    },
    {
        name: '经典蓝',
        value: 'classicBlue',
        dark: false
    },
    {
        name: '天空蓝',
        value: 'blueSky',
        dark: false
    },
    {
        name: '脑残粉',
        value: 'brainImpairedPink',
        dark: false
    },
    {
        name: '暗色',
        value: 'dark',
        dark: true
    },
    {
        name: '泥土黄',
        value: 'earthYellow',
        dark: false
    },
    {
        name: '清新绿',
        value: 'freshGreen',
        dark: false
    },
    {
        name: '清新红',
        value: 'freshRed',
        dark: false
    },
    {
        name: '浪漫紫',
        value: 'romanticPurple',
        dark: false
    },
    {
        name: '粉红葡萄',
        value: 'pinkGrape',
        dark: false
    },
    {
        name: '薄荷',
        value: 'mint',
        dark: false
    },
    {
        name: '金色vip',
        value: 'gold',
        dark: false
    },
    {
        name: '活力橙',
        value: 'vitalityOrange',
        dark: false
    },
    {
        name: '绿叶',
        value: 'greenLeaf',
        dark: false
    },
    {
        name: '脑图经典',
        value: 'classic',
        dark: true
    },
    {
        name: '脑图经典4',
        value: 'classic4',
        dark: false
    },
    {
        name: '小黄人',
        value: 'minions',
        dark: false
    },
    {
        name: '简约黑',
        value: 'simpleBlack',
        dark: false
    },
    {
        name: '课程绿',
        value: 'courseGreen',
        dark: false
    },
    {
        name: '咖啡',
        value: 'coffee',
        dark: false
    },
    {
        name: '红色精神',
        value: 'redSpirit',
        dark: false
    },
    {
        name: '黑色幽默',
        value: 'blackHumour',
        dark: true
    },
    {
        name: '深夜办公室',
        value: 'lateNightOffice',
        dark: true
    },
    {
        name: '黑金',
        value: 'blackGold',
        dark: true
    },
    {
        name: '牛油果',
        value: 'avocado',
        dark: false
    },
    {
        name: '秋天',
        value: 'autumn',
        dark: false
    },
    {
        name: '橙汁',
        value: 'orangeJuice',
        dark: true
    }
]

// 常量
export const CONSTANTS = {
    CHANGE_THEME: 'changeTheme',
    CHANGE_LAYOUT: 'changeLayout',
    SET_DATA: 'setData',
    TRANSFORM_TO_NORMAL_NODE: 'transformAllNodesToNormalNode',
    MODE: {
        READONLY: 'readonly',
        EDIT: 'edit'
    },
    LAYOUT: {
        LOGICAL_STRUCTURE: 'logicalStructure',
        MIND_MAP: 'mindMap',
        ORGANIZATION_STRUCTURE: 'organizationStructure',
        CATALOG_ORGANIZATION: 'catalogOrganization',
        TIMELINE: 'timeline',
        TIMELINE2: 'timeline2',
        FISHBONE: 'fishbone',
        VERTICAL_TIMELINE: 'verticalTimeline'
    },
    DIR: {
        UP: 'up',
        LEFT: 'left',
        DOWN: 'down',
        RIGHT: 'right'
    },
    KEY_DIR: {
        LEFT: 'Left',
        UP: 'Up',
        RIGHT: 'Right',
        DOWN: 'Down'
    },
    SHAPE: {
        RECTANGLE: 'rectangle',
        DIAMOND: 'diamond',
        PARALLELOGRAM: 'parallelogram',
        ROUNDED_RECTANGLE: 'roundedRectangle',
        OCTAGONAL_RECTANGLE: 'octagonalRectangle',
        OUTER_TRIANGULAR_RECTANGLE: 'outerTriangularRectangle',
        INNER_TRIANGULAR_RECTANGLE: 'innerTriangularRectangle',
        ELLIPSE: 'ellipse',
        CIRCLE: 'circle'
    },
    MOUSE_WHEEL_ACTION: {
        ZOOM: 'zoom',
        MOVE: 'move'
    },
    INIT_ROOT_NODE_POSITION: {
        LEFT: 'left',
        TOP: 'top',
        RIGHT: 'right',
        BOTTOM: 'bottom',
        CENTER: 'center'
    },
    LAYOUT_GROW_DIR: {
        LEFT: 'left',
        TOP: 'top',
        RIGHT: 'right',
        BOTTOM: 'bottom'
    },
    PASTE_TYPE: {
        CLIP_BOARD: 'clipBoard',
        CANVAS: 'canvas'
    },
    SCROLL_BAR_DIR: {
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal'
    },
    CREATE_NEW_NODE_BEHAVIOR: {
        DEFAULT: 'default',
        NOT_ACTIVE: 'notActive',
        ACTIVE_ONLY: 'activeOnly'
    }
}

export const initRootNodePositionMap = {
    [CONSTANTS.INIT_ROOT_NODE_POSITION.LEFT]: 0,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.TOP]: 0,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.RIGHT]: 1,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.BOTTOM]: 1,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.CENTER]: 0.5
}

//  布局结构列表
export const layoutList = [
    {
        name: '逻辑结构图',
        value: CONSTANTS.LAYOUT.LOGICAL_STRUCTURE
    },
    {
        name: '思维导图',
        value: CONSTANTS.LAYOUT.MIND_MAP
    },
    {
        name: '组织结构图',
        value: CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE
    },
    {
        name: '目录组织图',
        value: CONSTANTS.LAYOUT.CATALOG_ORGANIZATION
    },
    {
        name: '时间轴',
        value: CONSTANTS.LAYOUT.TIMELINE
    },
    {
        name: '时间轴2',
        value: CONSTANTS.LAYOUT.TIMELINE2
    },
    {
        name: '竖向时间轴',
        value: CONSTANTS.LAYOUT.VERTICAL_TIMELINE
    },
    {
        name: '鱼骨图',
        value: CONSTANTS.LAYOUT.FISHBONE
    }
];

export function buildMindMapData(): MindMapTreeData {
  return {
    "layout": "logicalStructure",
    "root": {
      "data": {
        "text": "根节点",
        "expand": true,
        "isActive": false,
        "uid": "47fe79a5-2690-4343-8fbf-74c350d4b92f",
        richText: false,
      }, "children": []
    } as MindMapTreeNode,
    "theme": {"template": 'default', "config": {}},
    "view": {
      "transform": {
        "scaleX": 1,
        "scaleY": 1,
        "shear": 0,
        "rotate": 0,
        "translateX": 0,
        "translateY": 0,
        "originX": 0,
        "originY": 0,
        "a": 1,
        "b": 0,
        "c": 0,
        "d": 1,
        "e": 0,
        "f": 0
      },
      "state": {"scale": 1, "x": 0, "y": 0, "sx": 0, "sy": 0}
    }
  };
}