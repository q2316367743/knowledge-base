import {useGlobalStore} from "@/store/GlobalStore";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import {base64toBlob} from "@/utils/BrowserUtil";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {getAttachmentBySync} from "@/utils/utools/DbStorageUtil";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import {useImageUploadByPlugin} from "@/plugin/image";
import {useEditorRefreshFolder} from "@/global/BeanFactory";
import {TreeNode} from "@/plugin/sdk/ZTree";

/**
 * 文件上传组件
 * @param path 文件路径
 * @param data 图片数据
 * @return 链接
 */
export async function useEcImageUpload(path: string, data: File | string): Promise<string> {

    useGlobalStore().startLoading("开始上传图片");

    try {
        let url = await selfImageUpload(path, data);
        if (Constant.platform === PlatformTypeEnum.TAURI) {
            url = getAttachmentBySync(url);
        }
        return Promise.resolve(url);
    } catch (e) {
        return Promise.reject(e)
    } finally {
        useGlobalStore().closeLoading();
    }

}

function renderToc(path: string) {
    // 此处判断刷新目录
    const current: TreeNode = {key: path, name: "", isLeaf: true};
    const folder = useEditorDriverStore().service.findFolder(current);
    const treeNodes = useEditorDriverStore().itemsMap.get(folder.key);
    if (treeNodes && treeNodes.findIndex(e => e.name === "image") === -1) {
        // 刷新父节点
        useEditorRefreshFolder.emit(folder);
    }
    const treeNode = useEditorDriverStore().service.findImageFolder(current);
    useEditorRefreshFolder.emit(treeNode);
}

async function selfImageUpload(path: string, data: File | Blob | string): Promise<string> {
    if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.INNER) {
        const url = await useEditorDriverStore().service.upload(path, data);
        // 上传到内部，需要判断是否刷新目录
        renderToc(path);
        return url;
    } else if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useLskyProSettingStore().upload(data)
    } else if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.IMAGE) {
        return useImageUploadByPlugin(data).then(() => (""));
    }
    return Promise.reject("请在基础设置中选择图片上传策略")

}
