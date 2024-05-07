import {defineStore} from "pinia";
import {computed, h, ref} from "vue";
import {TreeNodeData} from "@arco-design/web-vue";
import {contains, group, map, MapWrap} from "@/utils/lang/ArrayUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {IconFile, IconFolder} from "@arco-design/web-vue/es/icon";
import {getFromOneByAsync, listRecordByAsync, removeOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {PluginSettingContent, PluginSettingIndex, PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";

export const PLUGIN_FOLDER_KEYS = ['theme', 'markdown-menu', 'markdown-syntax'];

export interface PluginItem {
    id: number;
    name: string;
    content: string;
}

export const pluginTypes = [{
    key: PluginSettingTypeEnum.ALL,
    title: '全部'
}, {
    key: PluginSettingTypeEnum.THEME,
    title: '主题'
}, {
    key: PluginSettingTypeEnum.MARKDOWN_MENU,
    title: 'markdown菜单'
},{
    key: PluginSettingTypeEnum.MARKDOWN_SYNTAX,
    title: 'markdown语法'
},{
    key: PluginSettingTypeEnum.RICH_TEXT_PLUGIN,
    title: '富文本语法'
},{
    key: PluginSettingTypeEnum.MARKDOWN_TEMPLATE,
    title: 'markdown模板'
}];

export const pluginTypeMap = map(pluginTypes, 'key')

export const usePluginSettingStore = defineStore(LocalNameEnum.SETTING_PLUGIN, () => {
    const items = ref(new Array<PluginSettingIndex>())
    let rev: string | undefined = undefined;

    const pluginTree = computed<Array<TreeNodeData>>(() => {
        const itemMap = group(items.value, 'type');
        return [{
            key: 'theme',
            title: '主题',
            isLeaf: false,
            icon: () => h(IconFolder),
            children: itemMap.getOrDefault(PluginSettingTypeEnum.THEME, []).map(item => ({
                key: item.id,
                title: item.name,
                isLeaf: true,
                icon: () => h(IconFile)
            }))
        }, {
            key: 'markdown-menu',
            title: 'markdown菜单',
            isLeaf: false,
            icon: () => h(IconFolder),
            children: itemMap.getOrDefault(PluginSettingTypeEnum.MARKDOWN_MENU, []).map(item => ({
                key: item.id,
                title: item.name,
                isLeaf: true,
                icon: () => h(IconFile)
            }))
        }, {
            key: 'markdown-syntax',
            title: 'markdown语法',
            isLeaf: false,
            icon: () => h(IconFolder),
            children: itemMap.getOrDefault(PluginSettingTypeEnum.MARKDOWN_SYNTAX, []).map(item => ({
                key: item.id,
                title: item.name,
                isLeaf: true,
                icon: () => h(IconFile)
            }))
        }, {
            key: 'markdown-template',
            title: 'markdown模板',
            isLeaf: false,
            icon: () => h(IconFolder),
            children: itemMap.getOrDefault(PluginSettingTypeEnum.MARKDOWN_TEMPLATE, []).map(item => ({
                key: item.id,
                title: item.name,
                isLeaf: true,
                icon: () => h(IconFile)
            }))
        }];
    })
    const pluginMap = computed<MapWrap<number, PluginSettingIndex>>(() => map(items.value, 'id'))

    const markdownTemplates = computed(() =>
        items.value.filter(item => item.type === PluginSettingTypeEnum.MARKDOWN_TEMPLATE));

    async function init() {
        const res = await getFromOneByAsync<Array<PluginSettingIndex>>(LocalNameEnum.SETTING_PLUGIN);
        if (res.record) {
            items.value = res.record;
        }
        rev = res.rev;
    }

    async function save() {
        rev = await saveOneByAsync(LocalNameEnum.SETTING_PLUGIN, items.value, rev);
    }

    async function add(item: Omit<PluginSettingIndex, 'id'>) {
        const id = new Date().getTime();
        items.value.push({
            id,
            type: item.type,
            name: item.name
        });
        await save();
        await saveOneByAsync<PluginSettingContent>(`${LocalNameEnum.LIST_PLUGIN_CONTENT}/${id}`, {
            id,
            content: ''
        });
    }

    function rename(id: number, name: string) {
        const index = items.value.findIndex(item => item.id === id);
        if (index === -1) {
            // 不存在，新增一个
            return Promise.reject(new Error("插件不存在"));
        }
        items.value[index] = {
            ...items.value[index],
            name
        }
        return save();
    }

    function update(id: number, data: Partial<PluginSettingIndex>) {
        const index = items.value.findIndex(item => item.id === id);
        if (index === -1) {
            // 不存在，新增一个
            return Promise.reject(new Error("插件不存在"));
        }
        items.value[index] = {
            ...items.value[index],
            ...data
        }
        return save();
    }

    function saveContent(id: number, content: string, contentRev: string | undefined) {
        if (items.value.findIndex(item => item.id === id) === -1) {
            // 不存在，新增一个
            return Promise.reject(new Error("插件不存在"));
        }
        return saveOneByAsync(`${LocalNameEnum.LIST_PLUGIN_CONTENT}/${id}`, {id, content}, contentRev);
    }

    async function remove(id: number) {
        const index = items.value.findIndex(item => item.id === id);
        if (index === -1) {
            return Promise.reject(new Error("插件不存在"));
        }
        items.value.splice(index, 1);
        await save();
        // 删除内容
        await removeOneByAsync(`${LocalNameEnum.LIST_PLUGIN_CONTENT}/${id}`, true)
    }

    function getContent(id: number) {
        return getFromOneByAsync<PluginSettingContent>(`${LocalNameEnum.LIST_PLUGIN_CONTENT}/${id}`);
    }

    async function getPlugins(type: PluginSettingTypeEnum): Promise<Array<PluginItem>> {
        let indexes = items.value.filter(item => item.type === type);

        if (indexes.length === 0) {
            return Promise.resolve([])
        }

        // 过滤掉没启用的

        switch (type) {
            case PluginSettingTypeEnum.MARKDOWN_MENU:
                const {markdownMenus} = useThemeSettingStore();
                indexes = indexes.filter(item => contains(markdownMenus, item.id));
                break;
            case PluginSettingTypeEnum.MARKDOWN_SYNTAX:
                const {markdownSyntaxes} = useThemeSettingStore();
                indexes = indexes.filter(item => contains(markdownSyntaxes, item.id));
                break;
        }


        const records = await listRecordByAsync<PluginSettingContent>(indexes.map(item => `${LocalNameEnum.LIST_PLUGIN_CONTENT}/${item.id}`));

        const recordMap = map(records.map(record => record.record), 'id');

        return indexes.map(item => {
            const record = recordMap.getOrDefault(item.id, {id: item.id, content: ''});
            return {
                id: item.id,
                name: item.name,
                content: record.content
            }
        }).filter(item => item.content !== '');

    }

    async function getThemeContent(id: number): Promise<string> {
        const index = items.value.findIndex(item => item.id === id);

        if (index === -1) {
            return Promise.resolve('')
        }

        if (items.value[index].type !== PluginSettingTypeEnum.THEME) {
            return Promise.resolve('')
        }

        const record = await getFromOneByAsync<PluginSettingContent>(`${LocalNameEnum.LIST_PLUGIN_CONTENT}/${id}`);

        return record.record ? record.record.content : '';

    }

    return {
        plugins: items,pluginTree, pluginMap,markdownTemplates,
        init, save, add, update, rename, saveContent, remove, getContent,
        getPlugins, getThemeContent
    }

})
