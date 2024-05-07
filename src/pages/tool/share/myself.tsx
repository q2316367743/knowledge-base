import {myself} from "@/plugin/sdk/UtoolsShareManage/api";
import {
    Button,
    ButtonGroup,
    Drawer,
    List,
    ListItem,
    ListItemMeta,
    Radio,
    RadioGroup,
    Space,
    Tag
} from "@arco-design/web-vue";
import { pluginTypes} from "@/store/db/PluginSettingStore";
import {ref, watch} from "vue";
import {PluginCategoryScriptList, verityStatusEnum} from "@/plugin/sdk/UtoolsShareManage/types";

export async function openMyself() {
    const categoryId = ref(0);
    const records = ref<Array<PluginCategoryScriptList>>([]);
    const current = ref(1);
    const size = 20;
    const total = ref(0);
    const loading =ref(false);


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
                            <Tag color={'orange'}>{verityStatusEnum[record.verityStatus || 0]}</Tag>
                        </Space>
                    </>,
                    extra: () => <ButtonGroup type={'text'}>
                        <Button>记录</Button>
                        <Button disabled={record.verityStatus === 0}>更新</Button>
                        {record.verityStatus === 0 && <Button status={'danger'}>取消审核</Button>}
                    </ButtonGroup>
                }}
            </ListItem>)}
        </List>
    })

}
