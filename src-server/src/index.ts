import express from "express";
import db from "@/routers/db";
import file from "@/routers/file";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 静态文件服务

// 路由服务
app.use("/api/db", db);
app.use("/api/file", file);

app.listen(3000);
console.log("serve start at http://localhost:3000");
