import JSZip from "jszip";
import {useArticleStore} from "@/store/db/ArticleStore";
import {listToList} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {download} from "@/utils/BrowserUtil";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {MindMapTreeNode} from "@/editor/MindMapEditor/domain";
import {isUtools} from "@/global/BeanFactory";
import MessageUtil from "@/utils/modal/MessageUtil";
import {createDataByColumns, createDataNotColumns} from "@/editor/HandsontableEditor/hooks/ExportHook";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

/**
 * html转为markdown
 * @param html html内容
 */
export function htmlToMarkdown(html: string): string {
  return htmlToPlainText(html);
}

export function htmlToPlainText(html: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  return document.body.innerText;
}


export async function zipToFiles(file: File): Promise<File[]> {
  const files = new Array<File>()
  const jsZip = await JSZip.loadAsync(file);
  for (let path in jsZip.files) {
    const item = jsZip.files[path];
    if (item.dir) {
      continue;
    }
    const text = await item.async('blob');
    files.push(new File([text], path));
  }
  return files;
}

export async function articleToZip(folder: number): Promise<void> {
  const articleMap = useArticleStore().articleMap;
  const zip = new JSZip();
  // 查询全部目录结构
  let map = listToList(useFolderStore().folders, useArticleStore().folderMap, folder);
  let hasExcel = false;
  // 获取markdown内容
  for (let path of map.keys()) {
    const articleId = map.get(path);
    if (articleId) {
      const content = await getFromOneByAsync<ArticleContent<any>>(
        LocalNameEnum.ARTICLE_CONTENT + articleId);
      if (content.record) {
        const articleIndex = articleMap.get(articleId);
        if (articleIndex) {
          let cnt = content.record.content;
          if (articleIndex.type === ArticleTypeEnum.MARKDOWN || typeof articleIndex.type === 'undefined') {
            // markdown
            path = path + '.md'
          } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
            // 富文本
            path = path + '.html';
          } else if (articleIndex.type === ArticleTypeEnum.CODE) {
            // 代码笔记
          } else if (articleIndex.type === ArticleTypeEnum.DRAUU) {
            // 画板笔记
            path = path + '.svg';
          } else if (articleIndex.type === ArticleTypeEnum.HANDSONTABLE) {
            // 表格笔记，以JSON形式导出
            path = path + '.json';
            hasExcel = true;
            // 需要处理
            const data = cnt.data;
            const columns = cnt.columns;
            if (!data) {
              continue;
            }
            cnt = columns ? createDataByColumns(data, columns) : createDataNotColumns(data);
          } else {
            // 其他的不导出
            continue;
          }
          zip.file(path, cnt);
        }
      }
    }
  }
  const zipContent = await zip.generateAsync({type: "arraybuffer"});
  download(zipContent,
    "知识库|" + toDateTimeString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".zip",
    "application/zip");
  if (hasExcel) {
    const msg: string = '导出的笔记中包含表格笔记，请使用插件【Json & Excel】插件将json文件转为表格';
    if (isUtools) {
      InjectionUtil.showNotification(msg);
    } else {
      MessageUtil.warning(msg);
    }
  }
}

export function stringToBlob(str: string) {
  return new Blob([str], {type: 'text/plain'});
}

export function mindMapToMarkdown(data: any): string {
  // TODO：使用广度遍历
  throw new Error("暂不支持思维导图问答");
}

export function htmlToDocByDownload(htmlContent: string, fileName: string) {
  const blob = new Blob([htmlContent], {type: 'application/msword'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName + '.doc';
  a.click();
  URL.revokeObjectURL(url);
}

