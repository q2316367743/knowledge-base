import {handlePriorityColor, TodoItemAttr, TodoItemIndex, TodoItemPriority} from "@/entity/todo/TodoItem";
import {
    Button, DatePicker,
    Drawer,
    Form,
    FormItem, Popconfirm,
    Radio,
    RadioGroup, RangePicker,
    Space, Switch,
    Tag,
    Textarea
} from "@arco-design/web-vue";
import {ref, shallowRef, watch} from "vue";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {IconEdit} from "@arco-design/web-vue/es/icon";
import {clone} from "xe-utils";
import {createEditor, createToolbar, IDomEditor, IToolbarConfig} from "@wangeditor/editor";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useImageUpload} from "@/plugin/image";

function renderIsRange(attr: TodoItemAttr): boolean {
    if (attr.start === '' && attr.end === '') {
        return false;
    }
    return attr.start !== attr.end;

}

export async function openTodoItemInfo(index: TodoItemIndex, toUpdate?: (index: TodoItemIndex) => void) {
    const base = ref(clone(index, true));
    const todoItem = await useTodoStore().getTodoItem(index.id);
    const content = ref(todoItem.content);
    const attr = ref<TodoItemAttr>(await useTodoStore().getTodoItemAttr(index.id));
    const isRange = ref(renderIsRange(attr.value));
    const range = ref([attr.value.start, attr.value.end]);

    watch(() => range.value[0], (newValue) => {
        if (!isRange.value) {
            range.value[1] = newValue;
        }
    })

    const startAddTag = () => MessageBoxUtil.prompt("请输入标签名字").then(tag => content.value.record.tags.push(tag));

    function _openInfo() {
        openInfo(content.value.record.content).then(res => content.value.record.content = res);
    }

    function closeTag(e: string) {
        content.value.record.tags = content.value.record.tags.filter((tag) => tag !== e);
    }

    function onClose() {
        open.close();
    }

    async function onBeforeOk() {
        // 先更新索引
        await useTodoStore().updateById(index.id, base.value, {
            ...attr.value,
            start: range.value[0],
            end: range.value[1]
        });
        // 再更新属性
        // 再更新内容
        await useTodoStore().saveContent(index.id, content.value.record, content.value.rev);
        MessageUtil.success("保存成功");
        onClose();
        toUpdate && toUpdate(base.value);
    }

    function onRemove() {
        useTodoStore().removeById(index.id)
            .then(() => {
                MessageUtil.success("删除成功");
                onClose();
            })
            .catch(e => MessageUtil.error("删除失败", e));
    }

    const open = Drawer.open({
        title: '待办详情',
        width: 400,
        content: () => <Form model={base.value} layout={'vertical'}>
            <FormItem>
                <Textarea v-model={base.value.title} allowClear placeholder="请输入待办"
                          autoSize={{minRows: 2, maxRows: 8}}/>
            </FormItem>
            <FormItem label={'优先级'}>
                <RadioGroup v-model={base.value.priority} type={'button'}>
                    <Radio value={TodoItemPriority.HIGH}
                           style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}>高优先级</Radio>
                    <Radio value={TodoItemPriority.MIDDLE}
                           style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}>中优先级</Radio>
                    <Radio value={TodoItemPriority.FLOOR}
                           style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}>低优先级</Radio>
                    <Radio value={TodoItemPriority.NONE}
                           style={{color: handlePriorityColor(TodoItemPriority.NONE)}}>无优先级</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label={'置顶'}>
                <Switch v-model={base.value.top} />
            </FormItem>
            <FormItem>
                {{
                    label: () => <RadioGroup v-model={isRange.value} type={'button'}>
                        <Radio value={false}>时间</Radio>
                        <Radio value={true}>时间段</Radio>
                    </RadioGroup>,
                    default: () => {
                        if (isRange.value) {
                            return <RangePicker v-model={range.value}></RangePicker>
                        } else {
                            return <DatePicker v-model={range.value[0]}></DatePicker>
                        }
                    }
                }}
            </FormItem>
            <FormItem label={'标签'}>
                {content.value.record.tags.map(tag =>
                    <Tag color={'arcoblue'} style={{marginRight: '4px'}} closable
                         onClose={() => closeTag(tag)}>{tag}</Tag>)}
                <Button size={'mini'} type={'primary'} onClick={startAddTag}>新增</Button>
            </FormItem>
            <FormItem>
                {{
                    label: () => <div>
                        <span>备注</span>
                        <Button size={'mini'} type={'text'} style={{marginLeft: '7px'}} onClick={_openInfo}>
                            {{
                                icon: () => <IconEdit/>
                            }}
                        </Button></div>,
                    default: () => content.value.record.content ?
                        <div innerHTML={content.value.record.content}></div> :
                        <div style={{color: 'var(--color-text-3)'}}>请输入备注</div>
                }}
            </FormItem>
        </Form>,
        footer: () => <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Popconfirm content={'是否删除此待办，删除后不可恢复'} onOk={onRemove} okText={'删除'}
                        okButtonProps={{status: 'danger'}}>
                <Button type={'primary'} status={'danger'}>删除</Button>
            </Popconfirm>
            <Space>
                <Button onClick={onClose}>取消</Button>
                <Button type={'primary'} onClick={onBeforeOk}>保存</Button>
            </Space>
        </div>
    });
}

type AlertType = 'success' | 'info' | 'warning' | 'error';
type InsertFnType = (url: string, alt?: string, href?: string) => void

export function openInfo(_content: string) {
    const contentRef = ref();
    const toolbarRef = ref();

    const content = ref(_content);
    return new Promise<string>(resolve => {

        const editor = shallowRef<IDomEditor>();

        watch(() => contentRef.value, value => {
            if (!value) {
                return;
            }

            editor.value = createEditor({
                selector: value,
                html: content.value,
                config: {
                    placeholder: '请输入待办内容',
                    onChange(editor: IDomEditor) {
                        content.value = editor.getHtml();
                    },
                    customAlert: (info: string, type: AlertType) => {
                        MessageUtil[type](info);
                    },
                    scroll: false,
                    readOnly: false,
                    autoFocus: false,
                    MENU_CONF: {
                        uploadImage: {
                            customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
                                // async customUpload(file, insertFn) {                   // JS 语法
                                // file 即选中的文件
                                // 自己实现上传，并得到图片 url alt href
                                useImageUpload(file, true)
                                    .then(url => {
                                        if (url) {
                                            // 最后插入图片
                                            insertFn(url, file.name || "默认图片");
                                        }
                                    })
                            }
                        }
                    },
                    hoverbarKeys: {
                        // 在编辑器中，选中链接文本时，要弹出的菜单
                        link: {
                            menuKeys: [
                                'editLink', 'unLink', 'open-by-utools',
                            ],
                        },
                    },
                },
                mode: 'simple', // or 'simple'
            });
        });

        const toolbar = shallowRef<any>()


        watch(() => [toolbarRef.value, editor.value], value => {
            if (!value[0] || !value[1]) {
                return;
            }
            if (toolbar.value) {
                return;
            }
            const toolbarConfig: Partial<IToolbarConfig> = {
                toolbarKeys: ["blockquote", "header1", "header2", "header3", "|",
                    "bold", "underline", "italic", "through", "color", "bgColor", "clearStyle", "|",
                    "bulletedList", "numberedList", "todo",
                    {
                        "key": "group-layout",
                        "title": "对齐",
                        "iconSvg": "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\"><path d=\"M170.666667 213.333333h682.666666v85.333334H170.666667V213.333333z m0 512h682.666666v85.333334H170.666667v-85.333334z m0-256h682.666666v85.333334H170.666667v-85.333334z\" ></path></svg>",
                        "menuKeys": ["justifyLeft", "justifyRight", "justifyCenter"]
                    }, "|",
                    "insertLink",
                    {
                        "key": "group-image",
                        "title": "图片",
                        "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
                        "menuKeys": ["insertImage", "uploadImage"]
                    },
                    "insertVideo", "insertTable", "codeBlock"]
            }

            toolbar.value = createToolbar({
                editor: value[1],
                selector: value[0],
                config: toolbarConfig,
                mode: 'simple', // 'default' or 'simple'
            });

        })


        Drawer.open({
            width: 600,
            title: '备注',
            content: () => <div class={'kb-wang-editor'}>
                <div ref={toolbarRef}></div>
                <div ref={contentRef}></div>
            </div>,
            okText: '保存',
            onOk() {
                resolve(content.value);
            }
        })
    })
}
