import {useUmami} from "@/plugin/umami";
import {useLoading} from "@/hooks";
import {articleToZip} from "@/utils/file/ConvertUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getPlatform} from "@/utils/utools/common";
import {InjectionWebResult, http} from '@/utils/utools/common';

type ExportToZip = (pid: number) => Promise<void>;

const exportToZipByWeb = async (pid: number): Promise<void> => {
  const rsp = await http.get<InjectionWebResult<string>>('/background/export-zip', {
    params: {pid}
  });
  const {data} = rsp;
  const name = data.data;
  // 打开下载链接
  window.open(`/api/file/temp/${name}`, '_blank');
}

export const exportToZip = (pid: number) => {
  useUmami.track("导出数据为md");
  let func: ExportToZip;
  switch (getPlatform()) {
    case "web":
      func = exportToZipByWeb;
      break;
    case "uTools":
      func = articleToZip;
      break;
    default:
      return MessageUtil.error("当前平台无法导出")
  }
  const close = useLoading("正在准备数据")
  func(pid)
    .then(() => MessageUtil.success("导出成功"))
    .catch(e => MessageUtil.error("导出失败", e))
    .finally(() => close());
}