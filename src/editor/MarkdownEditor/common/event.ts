import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";

const DEV_URL = "http://localhost:5173/#";

export function onClickPreview(event: MouseEvent) {
  const aEle = event.target as HTMLElement;
  if (aEle) {
    if (aEle.tagName === 'A') {
      // 阻止默认行为和事件冒泡
      event.preventDefault();
      event.stopPropagation();
      // @ts-ignore
      const href = (aEle as HTMLLinkElement).href;
      if (href.startsWith(DEV_URL)) {
        // hash定位
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const id = href.replace(DEV_URL, "");
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView();
        }
        return;
      }
      if (!href.startsWith("http")) {
        // hash定位
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const targetIndex = href.lastIndexOf("#");
        if (targetIndex > -1) {
          const id = href.substring(targetIndex + 1, href.length);
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView();
          }
        }
        return;
      }
      utools.shellOpenExternal(href);
    } else if (aEle.tagName === 'IMG' || aEle.tagName === 'IMAGE') {
      const src = (aEle as HTMLImageElement).src;
      // @ts-ignore
      window.onImagePreview(src);
    } else if (aEle.classList.contains('relation-article')) {
      const title = aEle.getAttribute('data-title');
      if (title) {
        const real = decodeURIComponent(title);
        toArticleByRelation(real);
      }
    }
  }
}