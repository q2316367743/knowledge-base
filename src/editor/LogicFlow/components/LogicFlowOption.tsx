import {Ref} from "vue";
import {ColorPicker, Drawer, Form, FormItem, InputNumber, Radio, RadioGroup, Switch} from "@arco-design/web-vue";

export interface LogicFlowOption {
    miniMap: boolean,
    grid?: 'empty' | 'dot' | 'mesh',
    /**
     * 网格格子间距
     */
    gridSize?: number
    /**
     * 网格是否可见
     */
    gridVisible?: boolean
    /**
     * 网格的颜色
     */
    gridConfigColor: string
    /**
     * 网格的宽度
     * - 对于 `dot` 点状网格，表示点的大小
     * - 对于 `mesh` 交叉线网格，表示线的宽度
     */
    gridConfigThickness?: number
}

export function updateLogicFlowOption(option: Ref<LogicFlowOption>, onSave: () => void) {
    Drawer.open({
        title: '参数修改',
        width: 400,
        content: () => <Form model={option.value} layout={'vertical'}>
            <FormItem label={'是否显示小地图'}>
                <Switch v-model={option.value.miniMap}/>
            </FormItem>
            <FormItem label={'网格类型'}>{{
                default: () => <RadioGroup v-model={option.value.grid} defaultValue={'empty'}>
                    <Radio value={'empty'}>不显示网格</Radio>
                    <Radio value={'dot'}>点状网格</Radio>
                    <Radio value={'mesh'}>交叉线网格</Radio>
                </RadioGroup>,
                help: () => <div>重新打开编辑器生效</div>
            }}</FormItem>
            {(option.value.grid === 'dot' || option.value.grid === 'mesh') && <>
                <FormItem label={'网格格子间距'}>
                    <InputNumber v-model={option.value.gridSize} min={10} max={50} style={{width: '100%'}}/>
                </FormItem>
                <FormItem label={'网格是否可见'}>
                    <Switch v-model={option.value.gridVisible}/>
                </FormItem>
                <FormItem label={'网格颜色'}>
                    <ColorPicker v-model={option.value.gridConfigColor} showText/>
                </FormItem>
                <FormItem label={'网格点大小'}>{{
                    default: () => <InputNumber v-model={option.value.gridConfigThickness} min={1} max={10}/>,
                    help: () =>
                        <div>{option.value.grid === 'dot' ? '点状网格，表示点的大小' : '交叉线网格，表示线的宽度'}</div>
                }}</FormItem>
            </>}
        </Form>,
        footer: false,
        onClose: () => {
            onSave()
        },
    })
}
