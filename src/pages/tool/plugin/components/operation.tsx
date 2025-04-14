import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {parseType, renderType} from "@/pages/tool/plugin/components/func";
import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";
import {TreeOptionData} from "tdesign-vue-next";


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

export function editPlugin(node: TreeOptionData) {
    MessageBoxUtil.prompt('请输入新的名称', '重命名', {
        confirmButtonText: '新建',
        inputValue: node.label as string,
    }).then(name => usePluginSettingStore().rename(node.value as number, name)
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

