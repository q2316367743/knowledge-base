import App from 'express';
import DbController from "./controller/DbController";
import {join} from 'path';

const app = App();

app.use(App.static(join(__dirname,'../dist')));
app.use(App.json());
app.use(App.urlencoded({ extended: false }));

app.use('/api/db', DbController);

app.listen(3000, () => {
    console.log("服务启动在：http://127.0.0.1:3000");
})
