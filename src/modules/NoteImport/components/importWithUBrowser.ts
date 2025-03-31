import {NoteImportRule} from "@/modules/NoteImport/types";

interface ImportNoteResult {
  title: string;
  html: string;
  markdown: string;
}

export async function importWithUBrowser(url: string, props?: NoteImportRule): Promise<ImportNoteResult> {
  const {headers, timeout, wait, title, body} = props || {};
  let uBrowser = utools.ubrowser.goto(url,
    headers ? JSON.parse(headers) : undefined, timeout);
  if (wait) {
    // 等待元素出现
    uBrowser = uBrowser.wait(wait);
  }
  // 获取html
  uBrowser = uBrowser.evaluate(() => document.body.outerHTML);
  // @ts-ignore
  uBrowser = uBrowser.markdown(body || 'body');
  const results = await uBrowser.run({
    show: false
  });
  const html = results[0] as string;
  let markdown = results[1] as string;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const domTitle = doc.querySelector('title')?.innerText;
  const ruleTitle = title ? doc.querySelector(title)?.textContent : '';

  // markdown需要处理，![.*](.*)要变成![.*#100%](.*)
  markdown = markdown.replace(/!\[.*]\(.*\)/g, (match) => {
    return match.replace(/!\[.*]/, '![' + match.split('[')[1].split(']')[0] + '#100%]');
  });

  return {
    title: ruleTitle || domTitle || '',
    html,
    markdown
  };
}