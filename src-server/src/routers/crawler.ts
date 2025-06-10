import { Router } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { parse } from "rss-to-json";
import type { CrawlerMarkdownBody } from "@/views/crawler";
import { Result } from "@/views/Result";

const router = Router();
const turndownService = new TurndownService();

router.post("/markdown", async (req, res) => {
  const { url, props } = req.body as CrawlerMarkdownBody;
  if (!url) {
    res.status(400).send("url is required");
    return;
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
    if (!props) {
      res.send(Result.success({ title: "", markdown: "", html }));
      return;
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
    res.send(Result.success({ title: titleText, markdown, html }));
  } catch (e) {
    res.status(500).send(Result.error(e instanceof Error ? e.message : `${e}`));
  }
});

router.get("/rss", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    res.status(400).send(Result.error("url is required"));
    return;
  }
  try {
    const rss = await parse(`${url}`);
    res.send(Result.success(rss.items.map(item => {
      return {
        title: item.title,
        description: item.description,
        link: item.link,
        tags: item.category || [],
        author: item.author,
        image: '',
        pubDate: new Date(item.published),
        category: item.category || []
      }
    })));
  } catch (e) {
    res.status(500).send(Result.error(e instanceof Error ? e.message : `${e}`));
  }
});

export default router;
