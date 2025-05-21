import {IEditConfigType} from "@logicflow/core/src/model/EditConfigModel";
import {DrawerPlugin, Paragraph, Checkbox} from "tdesign-vue-next";


export function updateLogicFlowEditConfig(editConfig: Ref<IEditConfigType>, onSave: () => void) {
  const dp = DrawerPlugin({
    header: '编辑配置',
    size: '400px',
    default: () => <div>
      <Paragraph>
        <Checkbox v-model={editConfig.value.stopZoomGraph}>禁止缩放画布</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.stopScrollGraph}>禁止鼠标滚动移动画布</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.stopMoveGraph}>禁止拖动画布</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.adjustEdge}>允许调整边</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.adjustEdgeStartAndEnd}>允许调整边起点/终点</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.adjustNodePosition}>允许拖动节点</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.hideAnchors}>隐藏节点所有锚点</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.hoverOutline}>显示节点悬浮时的外框</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.nodeSelectedOutline}>节点选中时显示外边框</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.edgeSelectedOutline}>边选择时显示外边框</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.edgeTextDraggable}>允许边文本可以拖拽</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.edgeTextEdit}>允许边文本可以编辑</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.nodeTextEdit}>允许节点文本可以编辑</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.nodeTextDraggable}>允许节点文本可以拖拽</Checkbox>
      </Paragraph>
      <Paragraph>
        <Checkbox v-model={editConfig.value.textEdit}>允许文本编辑</Checkbox>
      </Paragraph>
    </div>,
    confirmBtn: '保存',
    onConfirm: () => {
      onSave();
      dp.destroy?.();
    },
  })
}
