import {ArticleImportRule} from "@/modules/ArticleImport/types";

interface ImportNoteResult {
  html: string;
  markdown: string;
}

export async function importWithUBrowser(url: string, props: ArticleImportRule): Promise<ImportNoteResult> {
  let uBrowser = utools.ubrowser.goto(url, JSON.parse(props.headers), props.timeout);
  if (props.wait) {
    // 等待元素出现
    uBrowser = uBrowser.wait(props.wait);
  }
  // 获取html
  uBrowser = uBrowser.evaluate(() => document.body.outerHTML);
  // @ts-ignore
  uBrowser = uBrowser.markdown(props.select);
  const results = await uBrowser.run({
    show: false
  });
  return {
    html: results[0] as string,
    markdown: results[1] as string
  };
}