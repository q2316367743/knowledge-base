import * as RssParser from "rss-to-json";
import { Result } from "~/views/Result";

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);
  if (!url) {
    return Result.error("url is required");
  }
  try {
    const rss = await RssParser.parse(`${url}`);
    return Result.success(
      rss.items.map((item) => {
        return {
          title: item.title,
          description: item.description,
          link: item.link,
          tags: item.category || [],
          author: item.author,
          image: "",
          pubDate: new Date(item.published),
          category: item.category || [],
        };
      })
    );
  } catch (e) {
    return Result.error(e instanceof Error ? e.message : `${e}`);
  }
});
