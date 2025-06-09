import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const baseDir = '/data/knowledge-base/file';


// 配置存储目录和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份补零
    const day = now.getDate().toString().padStart(2, '0'); // 日期补零
    const dir = path.join(baseDir, year, month, day); // 拼接年/月/日目录
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // 递归创建目录
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
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
  const relativePath = process.platform === 'win32' ? path.relative(baseDir, req.file.path).replace(/\\/g, '/') : path.relative(baseDir, req.file.path);
  res.json({
    name: req.file.originalname,
    key: relativePath,
    url: `/api/file/static/${relativePath}`
  });
});

router.use('/static', express.static(baseDir));

export default router;
