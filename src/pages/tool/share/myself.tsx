import {
    Button,
    ButtonGroup,
    Drawer,
    List,
    ListItem,
    ListItemMeta, Modal,
    Radio,
    RadioGroup,
    Space,
    Tag, Tooltip, Typography
} from "@arco-design/web-vue";
import {pluginTypes} from "@/store/db/PluginSettingStore";
import {ref, watch} from "vue";
import {PluginCategoryScriptList, verityStatusEnum} from "@/plugin/sdk/UtoolsShareManage/types/PluginScript";
import {downloadHistory, history, myself} from "@/plugin/sdk/UtoolsShareManage/api/PluginScriptUser";
import MessageUtil from "@/utils/modal/MessageUtil";
import {IconDownload, IconHeart} from "@arco-design/web-vue/es/icon";
import {submitModal} from "@/pages/tool/share/submit";

export async function openMyself() {
    const categoryId = ref(0);
    const records = ref<Array<PluginCategoryScriptList>>([]);
    const current = ref(1);
    const size = 20;
    const total = ref(0);
    const loading = ref(false);


    watch(categoryId, id => {
        loading.value = true;
        myself(id, current.value, size).then(pagination => {
            records.value = pagination.records || [];
            current.value = pagination.page || 1;
            total.value = pagination.total || 0;
        }).finally(() => loading.value = false);
    }, {immediate: true});

    Drawer.open({
        title: () => <RadioGroup type={'button'} v-model={categoryId.value}>
            {pluginTypes.map(type => <Radio value={type.key}>{type.title}</Radio>)}
        </RadioGroup>,
        width: 700,
        footer: false,
        content: () => <List bordered={false} loading={loading.value}>
            {records.value.map(record => <ListItem key={record.id} actionLayout={'vertical'}>
                {{
                    default: () => <>
                        <ListItemMeta title={record.name} description={record.description}/>
                        <Space>
                            <Tag color={'arcoblue'}>{record.categoryName}</Tag>
                            <Tag
                                color={record.verityStatus === 2 ? 'red' : 'orange'}>{verityStatusEnum[record.verityStatus || 0]}</Tag>
                            <Tag color={'arcoblue'}>
                                {{
                                    icon: () => <IconDownload/>,
                                    default: () => <span>{record.downloadCount}</span>
                                }}
                            </Tag>
                            <Tag color={'arcoblue'}>
                                {{
                                    icon: () => <IconHeart/>,
                                    default: () => <span>{record.likeCount}</span>
                                }}
                            </Tag>
                        </Space>
                    </>,
                    extra: () => <ButtonGroup type={'text'}>
                        <Button onClick={() => openHistory(record.id || 0)}>记录</Button>
                        <Button onClick={() => submitModal(record)} disabled={record.verityStatus === 0}>更新</Button>
                        {record.verityStatus === 0 && <Button status={'danger'} disabled>取消审核</Button>}
                    </ButtonGroup>
                }}
            </ListItem>)}
        </List>
    })

}

export function openHistory(id: number) {
    // 获取历史
    _openHistory(id).catch(e => MessageUtil.error("获取脚本历史失败", e));
}

async function _openHistory(id: number) {
    // 获取历史
    const items = await history(id);
    Drawer.open({
        title: '脚本历史',
        width: 500,
        footer: false,
        content: () => <List bordered={false}>
            {items.map(item => <ListItem>
                {{
                    default: () => <>
                        <ListItemMeta title={item.verityTime} description={item.log}/>
                        <Space>
                            <Tooltip content={item.reason}>
                                <Tag
                                    color={item.verityStatus === 2 ? 'red' : 'orange'}>{verityStatusEnum[item.verityStatus || 0]}</Tag>
                            </Tooltip>
                            <Tag color={'arcoblue'}>
                                {{
                                    icon: () => <IconDownload/>,
                                    default: () => <span>{item.downloadCount}</span>
                                }}
                            </Tag>
                            <Tag color={'arcoblue'}>
                                {{
                                    icon: () => <IconHeart/>,
                                    default: () => <span>{item.likeCount}</span>
                                }}
                            </Tag>
                        </Space>
                    </>,
                    extra: () => {
                        if (item.verityStatus === 0) {
                            //
                            return <Button type={'text'} status={'warning'} disabled
                                           onClick={() => showHistory(item.id || 0)}
                            >撤销</Button>
                        } else {
                            return <Button type={'text'} onClick={() => showHistory(item.id || 0)}
                            >查看</Button>
                        }
                    }
                }}
            </ListItem>)}
        </List>
    })
}

function showHistory(applicationId: number) {
    downloadHistory(applicationId)
        .then(res => {
            Modal.open({
                title: res.name,
                footer: false,
                content: () => <Typography>
                    <pre>{res.content}</pre>
                </Typography>
            })
        })
}

