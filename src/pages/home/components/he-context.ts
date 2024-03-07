import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {buildArticleName} from "@/store/setting/BaseSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useFolderStore} from "@/store/db/FolderStore";
import {convert} from "@/global/BeanFactory";

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
    MessageBoxUtil.confirm(`确认删除${article ? '文章' : '文件夹'}【${name}】？`, "删除提示", {
        confirmButtonText: "删除"
    }).then(() => {
        _remove(id, article)
            .then(() => MessageUtil.success("删除成功"))
            .catch(e => MessageUtil.error("删除失败", e));
    })
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
    convert.articleToZip(pid)
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useGlobalStore().closeLoading());
}
