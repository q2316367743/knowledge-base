import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
// 存储
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {buildArticleName} from "@/store/setting/BaseSettingStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useFolderStore} from "@/store/db/FolderStore";
// 工具类
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {articleToZip} from "@/utils/file/ConvertUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {h} from "vue";
import {IconBgColors, IconBook, IconCode, IconFile, IconMindMapping, IconNav} from "@arco-design/web-vue/es/icon";

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
        case ArticleTypeEnum.LOGIC_FLOW:
            return {
                config: {},
                record: {},
                editorConfig: {},
                option: {}
            };
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
    if (type === ArticleTypeEnum.EXCEL) {
        NotificationUtil.warning("未来版本中，将会删除表格笔记，请使用其他类型笔记！");
    }
    useGlobalStore().startLoading("正在新增文章")
    useArticleStore().add(getDefaultArticleIndex({
        name: buildArticleName(type),
        folder: pid,
        type,
    }), getDefaultArticleBase(), buildDefaultContent(type))
        .then(id => {
            MessageUtil.success("新增成功");
            useHomeEditorStore().openArticle(id);
            // 树选择
        })
        .catch(e => MessageUtil.error("新增失败", e))
        .finally(() => useGlobalStore().closeLoading());
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
        return h(IconBgColors, {})
    } else {
        return h(IconFile, {})
    }
}
