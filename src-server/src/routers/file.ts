import express from "express";
import multer from "multer";
import path, { join } from "path";
import fs from "fs";
import { Result } from "@/views/Result";
import { FILE_DIR, TEMP_DIR, db } from "@/global/constants";
import type { AttachmentInfo } from "@/views/AttachmentInfo";
import type { PouchValue } from "@/views/PouchValue";

const router = express.Router();

// 配置存储目录和文件名
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份补零
    const day = now.getDate().toString().padStart(2, "0"); // 日期补零
    const dir = path.join(FILE_DIR, year, month, day); // 拼接年/月/日目录
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // 递归创建目录
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now().toString();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

// 文件上传接口
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "未上传文件" });
    return;
  }
  const { filename } = req.body;
  const relativePath =
    process.platform === "win32"
      ? path.relative(FILE_DIR, req.file.path).replace(/\\/g, "/")
      : path.relative(FILE_DIR, req.file.path);
  const url = `/api/file/static/${relativePath}`;
  const name = filename || req.file.originalname;
  // 保存数据
  db.post<PouchValue<AttachmentInfo>>({
    _id: `/web/attachment/${relativePath}`,
    value: {
      filename: name,
      key: relativePath,
      uploadTime: Date.now(),
      type: req.file.mimetype,
      size: req.file.size,
      url,
    },
  }).catch(console.error);
  res.json({
    name,
    key: relativePath,
    url,
  });
});

router.use("/static", express.static(FILE_DIR));

router.get("/temp/:file", (req, res) => {
  const fileName = req.params.file;

  // 防止目录注入攻击
  const safePath = path.resolve(path.join(TEMP_DIR, fileName));

  // 验证路径是否在TEMP_DIR内
  if (!safePath.startsWith(path.resolve(TEMP_DIR))) {
    res.status(403).json(Result.error("禁止访问该文件"));
    return;
  }

  // 检查文件是否存在
  fs.access(safePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json(Result.error("文件不存在"));
      return;
    }

    // 检查是否为文件
    fs.stat(safePath, (statErr, stats) => {
      if (statErr) {
        res.status(500).json(Result.error("获取文件信息失败"));
        return;
      }

      if (!stats.isFile()) {
        res.status(403).json(Result.error("不允许访问目录"));
        return;
      }

      // 发送文件
      res.sendFile(safePath);
    });
  });
});

router.get("/attachments", (_req, res) => {
  // 可能存在的文件夹路径，进行图片筛选
  (async () => {
    const { rows } = await db.allDocs<PouchValue<AttachmentInfo>>({
      startkey: "/web/attachment",
      attachments: false,
      include_docs: true,
    });
    res.json(Result.success(rows.map((item) => item.doc).filter((e) => !!e)));
  })().catch((e) =>
    res.json(
      Result.error(
        "查询附件列表失败：" + (e instanceof Error ? e.message : `${e}`)
      )
    )
  );
});

router.delete("/delete", (req, res) => {
  // 文件路径，相对于FILE_DIR，必填
  const { key } = req.body;
  if (!key) {
    res.json(Result.error("文件路径不存在"));
    return;
  }
  // 获取附件
  db.get<PouchValue<AttachmentInfo>>(`/web/attachment/${key}`)
    .then((doc) => db.remove(doc))
    .catch(console.error);
  // 删除文件
  const abs = join(FILE_DIR, key as string);
  fs.unlink(abs, (err) => {
    if (err) {
      console.error(err);
      res.json(Result.error("删除文件失败：" + err.message));
    } else {
      res.json(Result.success("删除文件成功"));
    }
  });
});

export default router;
