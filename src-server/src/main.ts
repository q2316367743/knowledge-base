import App from 'express';
import {join} from 'path';
import auth from 'basic-auth';
import {verbose} from "sqlite3";
import {
    ATTACHMENT_PATH,
    DEFAULT_PASSWORD,
    DEFAULT_PORT,
    DEFAULT_USERNAME,
    STATIC_PATH,
    TABLE_PATH
} from "./global/Constant";
import buildDbController from "./controller/DbController";
import buildAttachmentController from "./controller/AttachmentController";
import multer from "multer";

const app = App();
const sqlite3 = verbose();

const db = new sqlite3.Database(join(__dirname, TABLE_PATH));
const upload = multer({ dest: join(__dirname, ATTACHMENT_PATH) });

app.use('/', (req, res, next) => {
    const credentials = auth(req);
    const username = process.env.USERNAME || DEFAULT_USERNAME; // 设置用户名
    const password = process.env.PASSWORD || DEFAULT_PASSWORD; // 设置密码

    if (!credentials || credentials.name !== username || credentials.pass !== password) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        return res.status(401).send('Unauthorized');
    }

    next();
});

app.use(App.static(join(__dirname, STATIC_PATH)));
app.use(App.json());
app.use(App.urlencoded({extended: false}));

app.use('/api/db', buildDbController(db));
app.use('/api/attachment', buildAttachmentController(db, upload));

app.listen(DEFAULT_PORT, () => {
    console.log(`服务启动在：http://127.0.0.1:${DEFAULT_PORT}`);
})
