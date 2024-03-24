import {Database} from "sqlite3";
import {Router} from "express";
import {Multer} from "multer";
import {Result} from "../global/Result";
import { readFile } from 'node:fs';
import {join} from "path";
import {ATTACHMENT_PATH} from "../global/Constant";

export default function buildAttachmentController(db: Database, upload: Multer): Router {

    const app = Router();

    app.post('/upload', upload.single("file"), (req, rsp) => {
        const file = req.file;
        if (file) {
            rsp.json(Result.success(`/api/attachment/file/${file.filename}`));
        } else {
            rsp.json(Result.error("上传失败"));
        }
    });

    app.get("/file/:filename", (req, rsp) => {
        const {filename} = req.params;
        // 读取文件并返回
        readFile(join(__dirname, '../', ATTACHMENT_PATH, filename), (err, data) => {
            if (err) {
                rsp.status(404).send('File not found');
                return;
            }
            rsp.send(data);

        })
    })

    return app;

}
