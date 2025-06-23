import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import type { CrawlerMarkdownBody } from "~/views/crawler";
import { Result } from "~/views/Result";

const turndownService = new TurndownService();

export default defineEventHandler(async (event) => {
  const { url, props } = await readBody<CrawlerMarkdownBody>(event);
  if (!url) {
    return Result.error("url is required");
  }
  const { headers, timeout, wait, title, body, userAgent } = props || {};
  try {
    // 获取内容
    const rsp = await axios.get<string>(url, {
      headers: {
        ...headers,
        "User-Agent":
          userAgent ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
      timeout,
      responseType: "text",
    });
    let html = rsp.data;
    if (!html) {
      return Result.success({ title: "", markdown: "", html });
    }
    // 解析html
    const $ = cheerio.load(html);
    // 获取标题
    const titleText = $(title).text() || $("title").text();
    // 获取内容
    if (body) {
      const bodyEl = $(body);
      const content = bodyEl.html();
      if (content) {
        html = content;
      }
    }
    // 将html转为markdown
    const markdown = turndownService.turndown(html);
    return Result.success({ title: titleText, markdown, html });
  } catch (e) {
    return Result.error(e instanceof Error ? e.message : `${e}`);
  }
});
