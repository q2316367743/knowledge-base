import {NoteImportRule} from "@/modules/NoteImport/types";

export interface ImportNoteResult {
  title: string;
  html: string;
  markdown: string;
}

export async function importWithUBrowser(url: string, props?: NoteImportRule): Promise<ImportNoteResult> {
  const {headers, timeout, wait, title, body, userAgent} = props || {};
  let uBrowser = utools.ubrowser.goto(url, {
    ...headers as any,
    userAgent
  }, timeout);
  if (wait) {
    // 等待元素出现
    if (typeof wait === 'number') {
      uBrowser = uBrowser.wait(wait);
    } else {
      uBrowser = uBrowser.wait(wait, timeout);
    }
  }
  // 获取html
  uBrowser = uBrowser.evaluate(() => {
    // 处理img可能存在的问题，有些图片的链在data-src中
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute("src");
      if (!src || !/^https?:\/\//.test(src)) {
        // 错误的链接
        for (let i = 0; i < img.attributes.length; i++) {
          const attribute = img.attributes[i]
          if (/^https?:\/\//.test(attribute.value)) {
            const match = attribute.value.match(/(https?:\/\/\S+)/g);
            if (match) {
              const value = match[0];
              if (value) {
                img.setAttribute('src', value);
                return;
              }
            }
          }
        }
      }
    });
    return document.body.outerHTML
  });
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