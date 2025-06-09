import { Router } from "express";
import PouchDB from "pouchdb";
import { Result } from "@/views/Result";

const db = new PouchDB("db", {
  prefix: "/data/knowledge-base/",
  auto_compaction: true,
});
const router = Router();

// 读取一个文档
router.get("/get", (req, res) => {
  const { key } = req.query;
  if (!key) {
    res.send(Result.error("key is required"));
    return;
  }
  db.get(key as string)
    .then((doc) => {
      res.send(Result.success(doc));
    })
    .catch((err) => {
      if (err.message) {
        res.send(Result.success(null));
      } else {
        console.log(err);
        res.send(Result.error(err.message));
      }
    });
});

// 写入一个文档
router.post("/put", (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    res.send(Result.error("key and value are required"));
    return;
  }
  db.put({ _id: key, ...value })
    .then((doc) => {
      res.send(Result.success(doc));
    })
    .catch((err) => {
      res.send(Result.error(err.message));
    });
});

// 删除一个文档
router.delete("/delete", (req, res) => {
  const { key } = req.query;
  if (!key) {
    res.send(Result.error("key is required"));
    return;
  }
  db.get(key as string)
    .then((doc) => {
      return db.remove(doc);
    })
    .then((doc) => {
      res.send(Result.success(doc));
    })
    .catch((err) => {
      res.send(Result.error(err.message));
    });
});

export default router;
