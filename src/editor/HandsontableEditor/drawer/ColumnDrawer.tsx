import {
  Alert,
  Button,
  DialogPlugin, DrawerPlugin,
  Form, FormItem,
  Input,
  Paragraph, Radio, RadioGroup,
  Select,
  Space,
  BaseTable, BaseTableCol, TagInput
} from "tdesign-vue-next";
import {clone} from "@/utils/lang/ObjectUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import Handsontable from "handsontable";

const types: Array<string> = ['autocomplete', 'checkbox', 'date', 'dropdown',
  'numeric', 'password', 'select', 'time', 'text',]
const translation: Record<string, string> = {
  'autocomplete': '自动完成',
  'checkbox': '开关',
  'date': '日期',
  'dropdown': '可搜索的选择框',
  'numeric': '数字',
  'password': '密码',
  'select': '下拉选择框',
  'time': '时间',
  'text': '文本',
}

/**
 * 更新列设置
 * @param columns 列设置
 * @see https://handsontable.com/docs/javascript-data-grid/cell-type/
 */
export function updateColumns(columns: Array<Handsontable.ColumnSettings>): Promise<Array<Handsontable.ColumnSettings>> {
  const columnsWrap = ref<Array<Handsontable.ColumnSettings>>(columns);
  const columnHeads: Array<BaseTableCol> = [{
    colKey: 'type',
    title: '类型',
    width: 75,
    cell(h, data) {
      return <span>{translation[data.row.type]}</span>
    },
  }, {
    colKey: 'title',
    title: '列名',
  }, {
    title: '操作',
    width: 150,
    align: 'center',
    cell(h, data) {
      return <div>
        <Button theme={'primary'} variant={'text'}
                onClick={() => updateColumnCell(columnsWrap as any, data.rowIndex)}>编辑</Button>
        <Button theme={'danger'} variant={'text'} onClick={() => remove(data.rowIndex)}>
          删除
        </Button>
      </div>
    },
  }]

  function add() {
    let index = columnsWrap.value.length;
    while (true) {
      const title = '列-' + index;
      if (columnsWrap.value.some(e => e.title === title)) {
        // 任意一个一样
        index += 1;
        continue;
      }
      columnsWrap.value.push({
        title: title,
        type: 'text',
        label: {
          position: 'before',
          value: ''
        }
      });
      return;
    }
  }

  function remove(index: number) {
    // TODO: 此处有BUG，删除列，不会删除数据
    columnsWrap.value.splice(index, 1);
  }

  function clear() {
    columnsWrap.value = [];
  }

  return new Promise<Array<Handsontable.ColumnSettings>>(resolve => {
    const dp = DrawerPlugin({
      header: '修改列设置',
      size: '50%',
      confirmBtn: '保存',
      default: () => <div>
        <Paragraph>
          <Alert>请注意，新增、删除列，并不会影响数据变化，只会影响表头</Alert>
          {columnsWrap.value.length === 0 && <blockquote
            style={{color: 'var(--td-warning-color)'}}>未自定义列，将自动生成列名，并可通过右键无线生成列。
            如果自定义了列，列数将只与此设置有关，无法在右键菜单中新增一列。</blockquote>}
        </Paragraph>
        <div class={'mb-8'}>
          <Space>
            <Button theme={"primary"} onClick={add}>
              新增
            </Button>
            {columnsWrap.value.length > 0 && <Button theme={"danger"} onClick={clear}>
              清空
            </Button>}
          </Space>
        </div>
        <BaseTable data={columnsWrap.value} columns={columnHeads} rowKey={'title'}/>
      </div>,
      onConfirm() {
        resolve(columnsWrap.value as Array<Handsontable.ColumnSettings>);
        dp.destroy?.();
      },
    });
  })
}

function updateColumnCell(columns: Ref<Array<Handsontable.ColumnSettings>>, index: number) {
  const column = ref<Handsontable.ColumnSettings>(clone(columns.value[index], true));
  const options = types.map(type => ({
    label: translation[type],
    value: type
  }));
  watch(() => column.value.type, t => {
    if (t === 'select' && !column.value.selectOptions) column.value.selectOptions = []
    if (t === 'dropdown' && !column.value.source) column.value.source = []
  })
  const dp = DialogPlugin({
    header: '新增列',
    placement: "center",
    draggable: true,
    default: () => <Form data={column.value}>
      <FormItem label={'列名'} labelAlign={'top'}>
        <Input placeholder="请输入列名" clearable={true} v-model={column.value.title}/>
      </FormItem>
      <FormItem label={'类型'} labelAlign={'top'}>
        <Select placeholder={"请选择类型"} v-model={column.value.type} options={options}/>
      </FormItem>
      {column.value.type === 'select' && <FormItem label={'下拉选项'} labelAlign={'top'}>
        <TagInput v-model={column.value.selectOptions} placeholder={'按回车以新增'}/>
      </FormItem>}
      {column.value.type === 'dropdown' && <FormItem label={'下拉选项'} labelAlign={'top'}>
        <TagInput v-model={column.value.source} placeholder={'按回车以新增'}/>
      </FormItem>}
      {(column.value.type === 'checkbox' && column.value.label) && <>
        <FormItem label={'选择框描述'} labelAlign={'top'}>
          <Input v-model={column.value.label!.value} placeholder={'请输入选择框描述'}/>
        </FormItem>
        <FormItem label={'位置'} labelAlign={'top'}>
          <RadioGroup v-model={column.value.label!.position}>
            <Radio value={'before'}>前面</Radio>
            <Radio value={'after'}>后面</Radio>
          </RadioGroup>
        </FormItem>
      </>}
    </Form>,
    onConfirm() {
      const title = column.value.title
      if (columns.value.some((e, i) => e.title === title && i !== index)) {
        MessageUtil.warning("列名已存在");
        return;
      }
      columns.value[index] = column.value as any;
      dp.destroy();
    },
  })
}
