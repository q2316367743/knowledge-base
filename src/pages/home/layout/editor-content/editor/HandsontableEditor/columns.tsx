import {
    Button, ButtonGroup,
    Drawer,
    Form,
    FormItem,
    Input, InputTag,
    Modal,
    Option, Radio, RadioGroup,
    Select,
    Space,
    Table, TypographyParagraph
} from "@arco-design/web-vue";
import {Ref, ref} from "vue";
import {clone} from "xe-utils";
import MessageUtil from "@/utils/modal/MessageUtil";
import {TableColumnData} from "@arco-design/web-vue/es/table/interface";
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
    const columnHeads: Array<TableColumnData> = [{
        dataIndex: 'title',
        title: '列名',
    }, {
        dataIndex: 'type',
        title: '类型',
        render(data) {
            return <span>{translation[data.record.type]}</span>
        },
    }, {
        title: '操作',
        width: 100,
        align: 'center',
        render(data) {
            return <ButtonGroup type={'text'}>
                <Button
                    onClick={() => updateColumnCell(columnsWrap as any, data.rowIndex)}>编辑</Button>
                <Button status="danger" onClick={() => remove(data.rowIndex)}>
                    删除
                </Button>
            </ButtonGroup>
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

    return new Promise<Array<Handsontable.ColumnSettings>>(resolve => {
        Drawer.open({
            title: '修改列设置',
            width: '50%',
            okText: '保存',
            content: () => <div>
                <TypographyParagraph>
                    <blockquote>请注意，新增、删除列，并不会影响数据变化，只会影响表头</blockquote>
                    {columnsWrap.value.length === 0 && <blockquote
                        style={{color: 'rgb(var(--warning-6))'}}>未自定义列，将自动生成列名，并可通过右键无线生成列。
                        如果自定义了列，列数将只与此设置有关，无法在右键菜单中新增一列。</blockquote>}
                </TypographyParagraph>
                <div class={'mb-8'}>
                    <Space>
                        <Button type="primary" onClick={add}>
                            新增
                        </Button>
                    </Space>
                </div>
                <Table data={columnsWrap.value} columns={columnHeads} rowKey={'title'} pagination={false}/>
            </div>,
            onOk() {
                resolve(columnsWrap.value as Array<Handsontable.ColumnSettings>);
            },
        });
    })
}

function updateColumnCell(columns: Ref<Array<Handsontable.ColumnSettings>>, index: number) {
    const column = ref<Handsontable.ColumnSettings>(clone(columns.value[index], true));
    Modal.open({
        title: '新增列',
        content: () => <Form model={{}} layout={'vertical'}>
            <FormItem label={'列名'}>
                <Input placeholder="请输入列名" allowClear v-model={column.value.title}/>
            </FormItem>
            <FormItem label={'类型'}>
                <Select placeholder={"请选择类型"} v-model={column.value.type}>
                    {types.map(type => <Option value={type}>{translation[type]}</Option>)}
                </Select>
            </FormItem>
            {column.value.type === 'select' && <FormItem label={'下拉选项'}>
                <InputTag v-model={column.value.selectOptions} placeholder={'按回车以新增'}/>
            </FormItem>}
            {column.value.type === 'dropdown' && <FormItem label={'下拉选项'}>
                <InputTag v-model={column.value.source} placeholder={'按回车以新增'}/>
            </FormItem>}
            {(column.value.type === 'checkbox' && column.value.label) && <>
                <FormItem label={'选择框描述'}>
                    <Input v-model={column.value.label!.value} placeholder={'请输入选择框描述'}/>
                </FormItem>
                <FormItem label={'位置'}>
                    <RadioGroup v-model={column.value.label!.position}>
                        <Radio value={'before'}>前面</Radio>
                        <Radio value={'after'}>后面</Radio>
                    </RadioGroup>
                </FormItem>
            </>}
        </Form>,
        onBeforeOk() {
            const title = column.value.title
            if (columns.value.some((e, i) => e.title === title && i !== index)) {
                MessageUtil.warning("列名已存在");
                return false;
            }
            return true;
        },
        onOk() {
            columns.value[index] = column.value as any;
        },
    })
}
