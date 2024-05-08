import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {getTokenThrow} from "@/plugin/Statistics";
import {Form, FormItem, Modal, Textarea, TreeSelect} from "@arco-design/web-vue";
import {ref, watch} from "vue";
import {submit} from "@/plugin/sdk/UtoolsShareManage/api/PluginScriptUser";
import {PluginCategoryScriptList} from "@/plugin/sdk/UtoolsShareManage/types/PluginScript";

interface SubmitData {
    id: number;
    description: string;
    log: string,
    sourceId?: number
}

export function submitModal(script?: PluginCategoryScriptList) {
    const data = ref<SubmitData>({
        id: 0,
        description: '',
        log: '',
    });
    const {pluginTree,plugins , getContent} = usePluginSettingStore();
    const pluginTreeWrap = pluginTree.map(e => ({
        ...e,
        selectable: false
    }));

    watch(() => data.value.id, id => {
        data.value.description = '';
        getContent(id)
            .then(res => {
                if (res.record) {
                    data.value.description = res.record?.description || '';
                }
            })
    });

    if (script) {
        data.value.sourceId = script.id;
        for (let plugin of plugins) {
            if (plugin.originId === script.id) {
                data.value.id = plugin.id;
                break;
            }
        }

    }

    Modal.open({
        title: script ? `更新脚本[${script ? script.name : ''}]` : '提交一个脚本',
        content: () => <Form model={data.value} layout={'vertical'}>
            <FormItem label={'请选择脚本'}>
                <TreeSelect data={pluginTreeWrap} v-model={data.value.id}/>
            </FormItem>
            <FormItem label={'更新日志'}>
                <Textarea autoSize={{minRows: 3, maxRows: 9}} maxLength={255} showWordLimit v-model={data.value.log}/>
            </FormItem>
            <FormItem label={'脚本描述'}>
                <Textarea autoSize={{minRows: 3, maxRows: 9}} maxLength={255} showWordLimit
                          v-model={data.value.description}/>
            </FormItem>
        </Form>,
        async onBeforeOk() {
            try {
                await submitPlugin(data.value);
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        onOk() {
            MessageUtil.success("提交成功")
        },
    })
}


export async function submitPlugin(data: SubmitData) {
    useGlobalStore().startLoading("正在提交中")
    _submitPlugin(data).then(() => MessageUtil.success("提交成功，请等待审核"))
        .catch(e => MessageUtil.error("提交审核失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

async function _submitPlugin(data: SubmitData) {
    const {pluginMap, getContent, saveContent, update} = usePluginSettingStore();
    const plugin = pluginMap.get(data.id);
    if (!plugin) return Promise.reject(new Error("插件不存在"));
    // 获取内容
    const contentRecord = await getContent(data.id);
    const content = contentRecord.record;
    if (!content) return Promise.reject(new Error("插件内容不存在"));
    let accessToken = '';
    try {
        accessToken = await getTokenThrow();
    } catch (e) {
        console.error(e);
        return Promise.reject(new Error("获取token失败，请确认是否已经登录utools"))
    }
    // 提交审核
    const res = await submit(plugin.type, {
        name: plugin.name,
        content: content.content,
        id: data.sourceId || plugin.originId,
        description: data.description,
        accessToken: accessToken
    });
    // 更新到插件上
    await update(data.id, {
        originId: res.id,
        originApplicationId: res.applicationId,
    })
    await saveContent(data.id, {
        id: data.id,
        content: content.content,
        description: data.description
    }, contentRecord.rev)
}
