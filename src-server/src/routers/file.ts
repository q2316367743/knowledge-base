import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Result } from "@/views/Result";

const router = express.Router();
const ROOT_DIR = "/app/knowledge-base";
const fileDir = `${ROOT_DIR}/file`;
const tempDir = `${ROOT_DIR}/temp`;

// 配置存储目录和文件名
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份补零
    const day = now.getDate().toString().padStart(2, "0"); // 日期补零
    const dir = path.join(fileDir, year, month, day); // 拼接年/月/日目录
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
  const relativePath =
    process.platform === "win32"
      ? path.relative(fileDir, req.file.path).replace(/\\/g, "/")
      : path.relative(fileDir, req.file.path);
  res.json({
    name: req.file.originalname,
    key: relativePath,
    url: `/api/file/static/${relativePath}`,
  });
});

router.use("/static", express.static(fileDir));

router.get("/temp/:file", (req, res) => {
  const fileName = req.params.file;

  // 防止目录注入攻击
  const safePath = path.resolve(path.join(tempDir, fileName));

  // 验证路径是否在tempDir内
  if (!safePath.startsWith(path.resolve(tempDir))) {
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

export default router;
