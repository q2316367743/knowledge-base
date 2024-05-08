import { downloadHistory, history} from "@/plugin/sdk/UtoolsShareManage/api/PluginScriptPublic";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Button, Drawer, List, ListItem, ListItemMeta} from "@arco-design/web-vue";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {computed} from "vue";

export function openHistory(id: number) {
    // 获取历史
    _openHistory(id).catch(e => MessageUtil.error("获取脚本历史失败", e));
}

async function _openHistory(id: number) {
    const installApplicationIds = computed(() => usePluginSettingStore().installApplicationIds);
    // 获取历史
    const items = await history(id);
    Drawer.open({
        title: '脚本历史',
        width: 500,
        footer: false,
        content: () => <List bordered={false}>
            {items.map(item => <ListItem>
                {{
                    default: <ListItemMeta title={item.verityTime} description={item.log}/>,
                    extra: <Button type={'text'} disabled={installApplicationIds.value.indexOf(item.id || 0) > -1}
                                   onClick={() => install(item.id)}>下载</Button>
                }}
            </ListItem>)}
        </List>
    })
}


function install(id?: number) {
    if (!id) {
        MessageUtil.warning("系统异常，脚本ID不存在")
        return;
    }
    useGlobalStore().startLoading("正在下载中")
    downloadHistory(id).then(res => {
        usePluginSettingStore().add({
            name: res.name || '',
            type: res.categoryId || 0,
            originApplicationId: res.applicationId,
            originId: res.id
        }, res.content)
            .then(() => MessageUtil.success("安装成功"))
            .catch(e => MessageUtil.error("安装失败", e))
            .finally(() => useGlobalStore().closeLoading());
    }).catch(e => {
        MessageUtil.error("下载失败", e);
        useGlobalStore().closeLoading();
    });
}
