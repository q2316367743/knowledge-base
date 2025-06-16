import { Router } from "express";
import JSZip from "jszip";
import fs from "fs/promises";
import path from "path";
import { db, TEMP_DIR } from "@/global/constants";
import { LocalNameEnum } from "@/global/LocalNameEnum";
import { Result } from "@/views/Result";
import type { PouchValue } from "@/views/PouchValue";
import type { ArticleIndex } from "@/views/ArticleIndex";
import { ArticleTypeEnum } from "@/views/ArticleIndex";
import { arrayGroup, arrayToMap } from "@/utils/ArrayUtil";
import type { ArticleContent } from "@/views/ArticleContent";
import { listToList } from "@/utils/TreeUtil";
import type { Folder } from "@/views/Folder";

const router = Router();

// 导出为ZIP
router.get("/export-zip", async (req, res) => {
  const { pid } = req.query;
  if (!pid) {
    res.json(Result.error("参数错误"));
    return;
  }
  const folder = parseInt(pid as string);
  if (isNaN(folder)) {
    res.json(Result.error("参数错误"));
    return;
  }
  try {
    // 获取全部的文章
    const { value: articles } = await db.get<PouchValue<Array<ArticleIndex>>>(
      LocalNameEnum.ARTICLE
    );
    const { value: folders } = await db.get<PouchValue<Array<Folder>>>(
      LocalNameEnum.FOLDER
    );

    const articleMap = arrayToMap(articles, "id");
    const noteFolderMap = arrayGroup(articles, "folder");
    const zip = new JSZip();
    // 查询全部目录结构
    let map = listToList(folders, noteFolderMap, folder);
    let hasExcel = false;
    // 获取markdown内容
    for (let path of map.keys()) {
      const articleId = map.get(path);
      if (articleId) {
        const { value: content } = await db.get<PouchValue<ArticleContent>>(
          LocalNameEnum.ARTICLE_CONTENT + articleId
        );
        if (content) {
          const articleIndex = articleMap.get(articleId);
          if (articleIndex) {
            let cnt = content.content;
            if (
              articleIndex.type === ArticleTypeEnum.MARKDOWN ||
              typeof articleIndex.type === "undefined"
            ) {
              // markdown
              path = path + ".md";
            } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
              // 富文本
              path = path + ".html";
            } else if (articleIndex.type === ArticleTypeEnum.CODE) {
              // 代码笔记
            } else if (articleIndex.type === ArticleTypeEnum.DRAUU) {
              // 画板笔记
              path = path + ".svg";
            } else {
              // 其他的不导出
              continue;
            }
            zip.file(path, cnt);
          }
        }
      }
    }
    const zipContent = await zip.generateAsync({ type: "uint8array" });
    const timestamp = Date.now();
    const filename = `${timestamp}.zip`;
    const filePath = path.join(TEMP_DIR, filename);

    // 确保目录存在
    await fs.mkdir(TEMP_DIR, { recursive: true });

    // 写入文件
    await fs.writeFile(filePath, zipContent);

    // 10分钟后自动删除文件
    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
        console.log(`Temporary file deleted: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete temporary file: ${err}`);
      }
    }, 10 * 60 * 1000); // 10分钟 = 600,000毫秒

    // 返回完整文件名
    res.json(Result.success(filename));
  } catch (e) {
    res.send(Result.error(e instanceof Error ? e.message : `${e}`));
  }
});

export default router;
