import {ColorPicker, DrawerPlugin, Form, FormItem, InputNumber, Radio, RadioGroup, Switch} from "tdesign-vue-next";

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
  const dp = DrawerPlugin({
    header: '参数修改',
    size: '400px',
    default: () => <Form data={option.value} class={'h-full overflow-auto'}>
      <FormItem label={'是否显示小地图'} labelAlign={'top'}>
        <Switch v-model={option.value.miniMap}/>
      </FormItem>
      <FormItem label={'网格类型'} labelAlign={'top'}>{{
        default: () => <RadioGroup v-model={option.value.grid} defaultValue={'empty'}>
          <Radio value={'empty'}>不显示网格</Radio>
          <Radio value={'dot'}>点状网格</Radio>
          <Radio value={'mesh'}>交叉线网格</Radio>
        </RadioGroup>,
        help: () => <div>重新打开编辑器生效</div>
      }}</FormItem>
      {(option.value.grid === 'dot' || option.value.grid === 'mesh') && <>
        <FormItem label={'网格格子间距'} labelAlign={'top'}>
          <InputNumber v-model={option.value.gridSize} min={10} max={50} style={{width: '100%'}}/>
        </FormItem>
        <FormItem label={'网格是否可见'} labelAlign={'top'}>
          <Switch v-model={option.value.gridVisible}/>
        </FormItem>
        <FormItem label={'网格颜色'} labelAlign={'top'}>
          <ColorPicker v-model={option.value.gridConfigColor}/>
        </FormItem>
        <FormItem label={'网格点大小'} labelAlign={'top'}>{{
          default: () => <InputNumber v-model={option.value.gridConfigThickness} min={1} max={10}/>,
          help: () =>
            <div>{option.value.grid === 'dot' ? '点状网格，表示点的大小' : '交叉线网格，表示线的宽度'}</div>
        }}</FormItem>
      </>}
    </Form>,
    closeBtn: true,
    confirmBtn: '保存',
    onConfirm: () => {
      onSave();
      dp.destroy?.();
    },
  })
}
