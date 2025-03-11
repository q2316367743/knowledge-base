import {HttpRequest} from "@/types/HttpRequest";
import HttpResponse from "@/types/HttpResponse";
import {buildUrl} from "@/algorithm/ParserEngine/bookUtil";

export default function uBrowser<T = string, D = any>(config: HttpRequest<D>): Promise<HttpResponse<T>> {
  const now = Date.now();

  if (utools.isDev()) {
    console.log('请求配置', config)
  }

  return new Promise((resolve, reject) => {
    const url = buildUrl(config.baseURL || '', config.url);
    const uBrowser = utools.ubrowser
      .goto(url, config.headers as any, config.timeout);
    if (config.wait) {
      const waitTimeout = parseInt(config.wait);
      if (isNaN(waitTimeout)) {
        // 字符串
        uBrowser.wait(config.wait, config.timeout);
      } else {
        // 数字
        uBrowser.wait(waitTimeout)
      }
    } else {
      // 未输入，默认等待10秒
      uBrowser.wait(10000)
    }
    uBrowser.evaluate(() => {
      return document.documentElement.outerHTML;
    })
      .cookies()
      .run({
        show: false
      })
      .then(results => {
        if (utools.isDev()) {
          console.log('请求地址', url)
        }
        const html = results[0] as T;
        const headers: Record<string, any> = {};
        if (Array.isArray(results[1])) {
          headers['set-cookie'] = (results[1] as any[])
            .map(item => `${item.name}=${item.value}`)
        }

        resolve({
          data: html,
          status: 200,
          statusText: 'OK',
          headers,
          config,
          requestTime: Date.now() - now
        });
      })
      .catch(error => {
        reject(error);
      })
  });
}
