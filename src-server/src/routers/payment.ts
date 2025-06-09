import { Router } from "express";
import fs from "fs";
import path from "path";
import { Result } from "@/views/Result";

const router = Router();
const dataDir = '/data/knowledge-base/payment';
const goodIdsFilePath = path.join(dataDir, 'goodIds.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 确保goodIds文件存在，如果不存在则创建一个包含空数组的文件
if (!fs.existsSync(goodIdsFilePath)) {
  fs.writeFileSync(goodIdsFilePath, JSON.stringify([]), 'utf8');
}

// 保存goodId到文件
router.post("/save", (req, res) => {
  const { goodId } = req.body;
  
  if (!goodId) {
    res.send(Result.error("goodId is required"));
    return;
  }
  
  try {
    // 读取现有的goodIds
    const goodIdsData = fs.readFileSync(goodIdsFilePath, 'utf8');
    const goodIds = JSON.parse(goodIdsData);
    
    // 检查goodId是否已存在，如果不存在则添加
    if (!goodIds.includes(goodId)) {
      goodIds.push(goodId);
      fs.writeFileSync(goodIdsFilePath, JSON.stringify(goodIds), 'utf8');
    }
    
    res.send(Result.success({ message: "goodId saved successfully" }));
  } catch (err) {
    console.error("Error saving goodId:", err);
    res.send(Result.error("Failed to save goodId"));
  }
});

// 获取所有保存的goodIds
router.get("/list", (req, res) => {
  try {
    const goodIdsData = fs.readFileSync(goodIdsFilePath, 'utf8');
    const goodIds = JSON.parse(goodIdsData);
    res.send(Result.success(goodIds));
  } catch (err) {
    console.error("Error reading goodIds:", err);
    res.send(Result.error("Failed to read goodIds"));
  }
});

export default router;