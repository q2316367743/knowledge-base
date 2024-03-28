import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
// 存储
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {buildArticleName, useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useFolderStore} from "@/store/db/FolderStore";
// 工具类
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {articleToZip} from "@/utils/file/ConvertUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
// 组件
import {h, ref} from "vue";
import {
    IconBook,
    IconCode, IconComputer,
    IconFile,
    IconMindMapping,
    IconNav,
    IconPalette
} from "@arco-design/web-vue/es/icon";
import {Form, FormItem, Input, Modal, Radio, RadioGroup, TreeSelect} from "@arco-design/web-vue";

// ------------------------------------------------------------------------------------------------------
// ----------------------------------------------- 全局配置 -----------------------------------------------
// ------------------------------------------------------------------------------------------------------


export function buildArticleIcon(type: ArticleTypeEnum) {
    if (type === ArticleTypeEnum.CODE) {
        return h(IconCode, {})
    } else if (type === ArticleTypeEnum.RICH_TEXT) {
        return h(IconBook, {})
    } else if (type === ArticleTypeEnum.EXCEL) {
        return h(IconNav, {})
    } else if (type === ArticleTypeEnum.MIND_MAP) {
        return h(IconMindMapping, {})
    } else if (type === ArticleTypeEnum.DRAUU) {
        return h(IconPalette, {})
    } else {
        return h(IconFile, {})
    }
}

export const articleTypes = [{
    key: ArticleTypeEnum.RICH_TEXT,
    name: '富文本',
    icon: IconBook,
}, {
    key: ArticleTypeEnum.MARKDOWN,
    name: 'markdown',
    icon: IconFile
}, {
    key: ArticleTypeEnum.CODE,
    name: '代码',
    icon: IconCode
}, {
    key: ArticleTypeEnum.MIND_MAP,
    name: '思维导图',
    icon: IconMindMapping
}, {
    key: ArticleTypeEnum.DRAUU,
    name: '画板',
    icon: IconPalette
}]

function buildDefaultContent(type: ArticleTypeEnum): any {
    switch (type) {
        case ArticleTypeEnum.MIND_MAP:
            return {
                "layout": "logicalStructure",
                "root": {
                    "data": {
                        "text": "根节点",
                        "expand": true,
                        "isActive": false,
                        "uid": "47fe79a5-2690-4343-8fbf-74c350d4b92f"
                    }, "children": []
                },
                "theme": {"template": 'default', "config": {}},
                "view": {
                    "transform": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "shear": 0,
                        "rotate": 0,
                        "translateX": 0,
                        "translateY": 0,
                        "originX": 0,
                        "originY": 0,
                        "a": 1,
                        "b": 0,
                        "c": 0,
                        "d": 1,
                        "e": 0,
                        "f": 0
                    },
                    "state": {"scale": 1, "x": 0, "y": 0, "sx": 0, "sy": 0}
                }
            }
        case ArticleTypeEnum.EXCEL:
            return {};
        default:
            return "";
    }
}

/**
 * 新增一篇文章
 * @param pid 父ID
 * @param type 文章类型
 */
export function addArticle(pid: number, type: ArticleTypeEnum) {
    _addArticle(pid, type).then(id => {
        MessageUtil.success("新增成功");
        useHomeEditorStore().openArticle(id);
    })
        .catch(e => MessageUtil.error("新增失败", e));
}

async function _addArticle(pid: number, type: ArticleTypeEnum) {
    if (type === ArticleTypeEnum.EXCEL) {
        NotificationUtil.warning("未来版本中，将会删除表格笔记，请使用其他类型笔记！");
    }
    const {newArticleAutoName, newArticleTemplateByName, codeExtraName} = useBaseSettingStore();
    let name: string;
    if (newArticleAutoName) {
        name = buildArticleName(type, newArticleTemplateByName, codeExtraName);
    } else {
        name = await MessageBoxUtil.prompt("请输入文章名称", "新建文章");
    }
    return useArticleStore().add(getDefaultArticleIndex({
        name,
        folder: pid,
        type,
    }), getDefaultArticleBase(), buildDefaultContent(type));
}

export function addArticleModal() {
    const {newArticleAutoName, newArticleTemplateByName, codeExtraName} = useBaseSettingStore();
    const name = ref(newArticleAutoName ? buildArticleName(ArticleTypeEnum.MARKDOWN, newArticleTemplateByName, codeExtraName) : '');
    const type = ref(ArticleTypeEnum.MARKDOWN);
    const folder = ref(0);
    const {folderTree} = useFolderStore();
    Modal.open({
        title: '新增文章',
        titleAlign: 'start',
        draggable: true,
        okText: '新增',
        content: () => <Form model={{}} layout={'vertical'}>
            <FormItem label={'文章类型'} required>
                <RadioGroup v-model={type.value}>
                    {articleTypes.map(item => <Radio key={item.key} value={item.key}>{item.name}</Radio>)}
                </RadioGroup>
            </FormItem>
            <FormItem label={'所在文件夹'} required>
                <TreeSelect data={folderTree} v-model={folder.value} placeholder={'请选择所在文件夹'}/>
            </FormItem>
            <FormItem label={'文章名称'} required>
                <Input v-model={name.value} class={'arco-input'} placeholder={'请输入文章名称'}/>
            </FormItem>
        </Form>,
        async onBeforeOk() {
            if (name.value.trim() === '') {
                MessageUtil.warning("请输入文章名称")
                return Promise.resolve(false);
            }
            const id = await useArticleStore().add(getDefaultArticleIndex({
                name: name.value,
                folder: folder.value,
                type: type.value,
            }), getDefaultArticleBase(), buildDefaultContent(type.value));
            useHomeEditorStore().openArticle(id);
            return Promise.resolve(true);
        }
    })
}

/**
 * 新增一个文件夹
 * @param pid 文件夹父ID
 */
export function addFolder(pid: number) {
    MessageBoxUtil.prompt("请输入文件夹名称", "新建文件夹", {
        confirmButtonText: "新增",
        cancelButtonText: "取消"
    }).then(name => {
        useFolderStore().addFolder(pid, name)
            .then(() => MessageUtil.success("新增成功"))
            .catch(e => MessageUtil.error("新增失败", e));
    })
}

/**
 * 删除一个文章或文件夹
 * @param id 文章或文件夹ID
 * @param name 文章或文件夹名
 * @param article 是否是文章
 */
export function remove(id: number, name: string, article: boolean) {
    if (article) {
        MessageBoxUtil.confirm(`确认删除文章【${name}】？`, "删除提示", {
            confirmButtonText: "删除",
        }).then(() => _remove(id, article)
            .then(() => MessageUtil.success("删除成功"))
            .catch(e => MessageUtil.error("删除失败", e)))
    } else {
        MessageBoxUtil.confirmMulti(`确认删除文件夹【${name}】？`, "删除提示", [{
            name: '删除文件夹及全部文件',
            action: () => {
                Promise.all([useFolderStore().removeFolder(id), useArticleStore().removeFolder(id)])
                    .then(() => MessageUtil.success("删除文件夹及全部文件成功"))
                    .catch(e => MessageUtil.error("删除文件夹及全部文件失败", e))
            }
        }, {
            name: '只删除文件夹',
            action: () => {

                useFolderStore().removeFolder(id)
                    .then(() => MessageUtil.success("只删除文件夹成功"))
                    .catch(e => MessageUtil.error("只删除文件夹失败", e))
            }
        }]).finally(() => console.debug("删除完成"))
    }
}

async function _remove(id: number, article: boolean) {
    if (article) {
        await useArticleStore().removeById(id)
    } else {
        // 删除文件夹
        await useFolderStore().removeFolder(id)
    }
}

/**
 * 重命名一个文章或文件夹
 * @param id 文章或文件夹ID
 * @param name 文章或文件夹名
 * @param article 是否是文章
 */
export function rename(id: number, name: string, article: boolean) {
    MessageBoxUtil.prompt(`请输入新的文件${article ? '' : '夹'}名称`, "重命名", {
        confirmButtonText: "确认",
        inputValue: name
    }).then(newName => {
        if (article) {
            // 重命名文件
            useArticleStore().updateIndex(id, {name: newName})
                .then(() => {
                    MessageUtil.success("重命名成功");
                    useHomeEditorStore().updateTitle(id, newName);
                })
                .catch(e => MessageUtil.error("重命名失败", e));
        } else {
            useFolderStore().renameFolder(id, newName)
                .then(() => MessageUtil.success("重命名成功"))
                .catch(e => MessageUtil.error("重命名失败", e));
        }
    })
}

// ------------------------------------------------------------------------------------------------------
// ----------------------------------------------- 导入相关 -----------------------------------------------
// ------------------------------------------------------------------------------------------------------


export function exportToMd(pid: number) {
    useGlobalStore().startLoading("正在准备数据")
    articleToZip(pid)
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useGlobalStore().closeLoading());
}
