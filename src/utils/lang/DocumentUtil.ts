/**
 * 辅助方法用于元素创建
 *
 * @param tagName - 创建元素的名称
 * @param classNames - 要添加的 CSS 类列表
 * @param attributes - 具有要添加的属性对象
 */
export function makeElement<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(tagName: T, classNames?: string | string[], attributes?: Record<K, string>): HTMLElementTagNameMap[T] {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    // @ts-ignore
    el[attrName] = attributes[attrName];
  }

  return el;
}

/**
 * 通过链接获取网站logo
 * @param url 网站链接
 */
export async function getLogoFromUrl(url: string) {
  const response = await fetch(url);
  if (response.ok) {
    const html = await response.text();
    // 从html中解析logo地址
    const logoUrl = html.match(/<link.*?rel="icon".*?href="(.*?)"/)?.[1];
    if (logoUrl) {
      return new URL(logoUrl, url).toString();
    } else {
      // 尝试获取网站默认图标，并判断是否存在
      const defaultIconUrl = new URL('/favicon.ico', url).toString();
      try {
        const response = await fetch(defaultIconUrl);
        if (response.ok) {
          return defaultIconUrl;
        }
      } catch (error) {
        console.error('Failed to fetch default icon:', error);
      }
    }
  }
  return '';

}

/**
 * 安全化html，去除html中的标签
 * @param html html字符串
 */
export function htmlDecode(html: string) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const output = temp.innerText || temp.textContent;
  temp.remove();
  return output || html;
}