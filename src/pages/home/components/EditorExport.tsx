import {useUmami} from "@/plugin/umami";
import {useGlobalStore} from "@/store/GlobalStore";
import {articleToZip} from "@/utils/file/ConvertUtil";
import MessageUtil from "@/utils/modal/MessageUtil";

export function exportToMd(pid: number) {
    useUmami.track("导出数据为md")
    useGlobalStore().startLoading("正在准备数据")
    articleToZip(pid)
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useGlobalStore().closeLoading());
}
