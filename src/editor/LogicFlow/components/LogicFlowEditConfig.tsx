import {Ref} from "vue";
import {IEditConfigType} from "@logicflow/core/src/model/EditConfigModel";
import {Drawer, Form, FormItem, Switch} from "@arco-design/web-vue";


export function updateLogicFlowEditConfig(editConfig: Ref<IEditConfigType>, onSave: () => void) {
    Drawer.open({
        title: '编辑配置',
        width: 400,
        content: () => <Form model={editConfig.value}
                             layout="vertical">
            <FormItem label="禁止缩放画布">
                <Switch v-model={editConfig.value.stopZoomGraph}/>
            </FormItem>
            <FormItem label="禁止鼠标滚动移动画布">
                <Switch v-model={editConfig.value.stopScrollGraph}/>
            </FormItem>
            <FormItem label="禁止拖动画布">
                <Switch v-model={editConfig.value.stopMoveGraph}/>
            </FormItem>
            <FormItem label="允许调整边">
                <Switch v-model={editConfig.value.adjustEdge}/>
            </FormItem>
            <FormItem label="允许调整边起点/终点">
                <Switch v-model={editConfig.value.adjustEdgeStartAndEnd}/>
            </FormItem>
            <FormItem label="允许拖动节点">
                <Switch v-model={editConfig.value.adjustNodePosition}/>
            </FormItem>
            <FormItem label="隐藏节点所有锚点">
                <Switch v-model={editConfig.value.hideAnchors}/>
            </FormItem>
            <FormItem label="显示节点悬浮时的外框">
                <Switch v-model={editConfig.value.hoverOutline}/>
            </FormItem>
            <FormItem label="节点选中时显示外边框">
                <Switch v-model={editConfig.value.nodeSelectedOutline}/>
            </FormItem>
            <FormItem label="边选择时显示外边框">
                <Switch v-model={editConfig.value.edgeSelectedOutline}/>
            </FormItem>
            <FormItem label="允许节点文本可以编辑">
                <Switch v-model={editConfig.value.nodeTextEdit}/>
            </FormItem>
            <FormItem label="允许文本编辑">
                <Switch v-model={editConfig.value.textEdit}/>
            </FormItem>
            <FormItem label="允许边文本可以编辑">
                <Switch v-model={editConfig.value.edgeTextEdit}/>
            </FormItem>
            <FormItem label="允许节点文本可以拖拽">
                <Switch v-model={editConfig.value.nodeTextDraggable}/>
            </FormItem>
            <FormItem label="允许边文本可以拖拽">
                <Switch v-model={editConfig.value.edgeTextDraggable}/>
            </FormItem>
        </Form>,
        okText: '保存',
        onOk: () => {
            onSave()
        },
    })
}
