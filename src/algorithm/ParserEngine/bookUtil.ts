import {template} from 'radash';
import {HttpRequestCore} from "@/types/HttpRequest";
import http from "@/plugin/http";
import uBrowser from "@/plugin/uBrowser";
import {renderHttpImage} from "@/plugin/server";
import HttpResponse from "@/types/HttpResponse";
import {useNProgress} from "@vueuse/integrations/useNProgress";
import {assignDeep} from "@/utils/lang/ObjectUtil";
import {isEmptyString} from "@/utils/lang/FieldUtil";

export function buildRequestHeaders(headers: string | Record<string, string>, cookie: string = '') {
  // 构建请求配置
  let commonHeader: Record<string, any> = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 QuarkPC/1.7.0.108'
  };
  // headers
  if (headers) {
    if (typeof headers === "string") {
      try {
        commonHeader = JSON.parse(headers);
      } catch (e) {
        console.error(e);
      }
    } else {
      commonHeader = headers;
    }
  }
  // cookie
  if (cookie) {
    commonHeader['cookie'] = cookie;
  }
  return commonHeader;
}

/**
 * 执行一个请求
 * @param source 配置对象
 * @param url 请求链接
 */
async function _request(url: string, source?: HttpRequestCore): Promise<HttpResponse<string>> {

  // 构建请求配置
  const _source = assignDeep<HttpRequestCore>({
    charset: 'utf-8',
    timeout: 15000,
    headers: '',
    cookie: '',
    method: 'GET',
    webview: false,
    wait: '',
  }, source);

  const defaultConfig = {
    url,
    charset: _source.charset || 'utf-8',
    timeout: _source.timeout || 15000,
    headers: buildRequestHeaders(source?.headers || '', _source.cookie),
    method: _source.method,
    webview: _source.webview,
    wait: _source.wait,
    data: _source.data
  }

  let response: HttpResponse<string>;

  if (defaultConfig.webview) {
    // webview
    response = await uBrowser<string>(defaultConfig);
  } else {
    response = await http<string>(defaultConfig);
  }

  if (utools.isDev()) {
    console.log('请求响应', response);
  }

  return response;
}


/**
 * 执行一个请求
 * @param source 配置对象
 * @param url 请求链接
 */
export async function request(url: string, source?: HttpRequestCore): Promise<HttpResponse<string>> {
  const {start, done} = useNProgress()
  start();
  try {
    return await _request(url, source);
  } catch (e) {
    return Promise.reject(e);
  } finally {
    done()
  }
}

function extractProtocolAndDomain(url: string) {
  const parsedUrl = new URL(url);
  return parsedUrl.protocol + '//' + parsedUrl.hostname;
}

export function buildUrl(base: string, url: string = ''): string {
  // 最后使用
  if (/https?:\/\//.test(url) || /feed-hub:\/\//.test(url)) {
    return url;
  }
  if (url.startsWith('//')) {
    return 'http:' + url;
  }
  if (url.startsWith('/')) {
    return extractProtocolAndDomain(base) + url;
  }

  let number = base.lastIndexOf("/");
  if (number > 0) {
    return base.substring(0, number + 1) + url;
  }
  return base + url;
}

/**
 * 使用 DOMParser 提取 HTML 文本内容
 * @param html
 */
export function extractTextUsingDOMParser(html: string): string {
  // 创建一个 DOMParser 实例
  const parser = new DOMParser();
  // 解析 HTML 字符串为 Document 对象
  const doc = parser.parseFromString(html, 'text/html');
  // 返回提取的文本内容
  return doc.body.innerText || doc.body.textContent || html;
}

/**
 * 截取一个字符串的前 n 个字符，并加上省略号
 * @param str
 * @param n
 */
export function truncateString(str: string, n: number): string {
  if (str.length <= n) {
    return str;
  }
  return str.substring(0, n) + '...';
}

export function trimString(str: string): string {
  if (!str) {
    return '';
  }
  return `${str}`.trim();
}

interface RenderUrlResult {
  requestUrl: string;
  allowPage: boolean;
}

export function renderUrl(url: string, data: Record<string, any>): RenderUrlResult {
  let allowPage = url.includes('{{page}}');
  // 此处是为了处理一些特殊的情况，比如 {{page}} 等
  const requestUrl = template(url, data);
  return {requestUrl, allowPage};
}

export const AsyncFunction = Object.getPrototypeOf(async function () {
}).constructor;


export function renderHtml(html: string, url: string): string {
  if (isEmptyString(html)) {
    return '';
  }
  return html.replaceAll(/\s+src="(\S*)"\s+/g, (_s, item) => {
    // 掘金特殊处理
    item = item.replaceAll('&amp;', '&');
    // 处理url问题
    item = buildUrl(url, item);
    return ` src="${renderHttpImage(item)}" `
  });
}
