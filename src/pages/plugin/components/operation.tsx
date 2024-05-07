import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {parseType, renderType} from "@/pages/plugin/components/func";
import {TreeNodeData} from "@arco-design/web-vue";
import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";
import {submit} from "@/plugin/sdk/UtoolsShareManage/api";
import {getTokenThrow} from "@/plugin/Statistics";
import {useGlobalStore} from "@/store/GlobalStore";


export function createPlugin(key: string | number) {
    const type = parseType(key.toString());
    if (!type) {
        return MessageUtil.error("未知类型");
    }
    if (type === PluginSettingTypeEnum.MARKDOWN_SYNTAX) {
        return MessageUtil.warning("不支持新建Markdown语法");
    }
    const content = renderType(type);
    MessageBoxUtil.prompt(`请输入${content}名称`, '新建' + content, {
        confirmButtonText: '新建',
    }).then(name => usePluginSettingStore().add({name, type})
        .then(() => MessageUtil.success("新建成功"))
        .catch(e => MessageUtil.error("新建失败", e)));
}

export function editPlugin(node: TreeNodeData) {
    MessageBoxUtil.prompt('请输入新的名称', '重命名', {
        confirmButtonText: '新建',
        inputValue: node.title,
    }).then(name => usePluginSettingStore().rename(node.key as number, name)
        .then(() => MessageUtil.success("新建成功"))
        .catch(e => MessageUtil.error("新建失败", e)));
}

export function removePlugin(id: number) {
    MessageBoxUtil.confirm("确定删除吗？", "删除", {
        confirmButtonText: '删除',
    }).then(() => usePluginSettingStore().remove(id)
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => MessageUtil.error("删除失败", e)));
}

export async function submitPlugin(id: number) {
    useGlobalStore().startLoading("正在提交中")
    _submitPlugin(id).then(() => MessageUtil.success("提交成功，请等待审核"))
        .catch(e => MessageUtil.error("提交审核失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

async function _submitPlugin(id: number) {
    const {pluginMap, getContent, update} = usePluginSettingStore();
    const plugin = pluginMap.get(id);
    if (!plugin) return Promise.reject(new Error("插件不存在"));
    // 获取内容
    const contentRecord = await getContent(id);
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
        id: plugin.originId,
        description: content.description,
        accessToken: accessToken
    });
    // 更新到插件上
    await update(id, {
        originId: res.id,
        originApplicationId: res.applicationId,
    })
}
