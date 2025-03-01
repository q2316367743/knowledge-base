/**
 * 辅助方法用于元素创建
 *
 * @param tagName - 创建元素的名称
 * @param classNames - 要添加的 CSS 类列表
 * @param attributes - 具有要添加的属性对象
 */
export function make<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(tagName: T, classNames?: string | string[], attributes?: Record<K, string>): HTMLElementTagNameMap[T] {
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