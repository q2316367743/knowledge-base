import MindMap from "simple-mind-map";
import {
    Card,
    Form,
    FormItem,
    Input,
    InputGroup,
    InputNumber,
    Modal,
    Radio,
    RadioGroup, Switch,
    TypographyText
} from "@arco-design/web-vue";
import {ref} from "vue";
import './index.css';
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";

const items = [{
    key: 1,
    name: '图片',
    desc: '适合查看分享'
}, {
    key: 2,
    name: 'SVG',
    desc: '可缩放矢量图形'
}, {
    key: 3,
    name: 'PDF',
    desc: '适合打印'
}, {
    key: 4,
    name: 'Markdown',
    desc: '便于其他软件打开'
}, {
    key: 5,
    name: 'XMind',
    desc: 'XMind格式'
}]

export function openMindMapExport(mindMap: MindMap, id: number) {
    console.log(mindMap)
    const articleIndex = useArticleStore().articleMap.get(id);
    const title = ref(articleIndex ? articleIndex.name : '');
    const type = ref(1);
    Modal.open({
        title: '导出',
        draggable: true,
        width: 600,
        onBeforeOk() {
            if (title.value.trim() === '') {
                MessageUtil.warning("请输入文件名");
                return false;
            }
            return true;
        },
        onOk() {
            if (type.value === 1) {
                mindMap.export('png', true, title.value);
            } else if (type.value === 2) {
                mindMap.export('svg', true, title.value);
            } else if (type.value === 3) {
                mindMap.export('pdf', true, title.value);
            } else if (type.value === 4) {
                mindMap.export('md', true, title.value);
            } else if (type.value === 5) {
                mindMap.export('xmind', title.value);
            }

        },
        content: () => <div>
            <InputGroup style={{marginBottom: '7px'}}>
                <span style="width: 160px">导出文件名称：</span>
                <Input v-model={title.value} allowClear/>
            </InputGroup>
            <RadioGroup v-model={type.value}>
                {items.map(item => <Radio value={item.key}>
                    {{
                        radio: (data: { checked: boolean }) => {
                            return <div
                                class={data.checked ? 'custom-radio-card custom-radio-card-checked' : 'custom-radio-card'}
                            >
                                <div class="custom-radio-card-top">
                                    <div class="custom-radio-card-mask">
                                        <div class="custom-radio-card-mask-dot"/>
                                    </div>
                                    <div class="custom-radio-card-title">
                                        {item.name}
                                    </div>
                                </div>
                                <div class="custom-radio-card-desc">
                                    {item.desc}
                                </div>
                            </div>
                        }
                    }}
                </Radio>)}
            </RadioGroup>
        </div>
    })
}
