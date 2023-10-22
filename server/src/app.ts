import express from 'express';
import { Result } from './domain/Result';
import dbRouter from './router/DbRouter';
import { join } from 'path';

const app = express();
const token: string = process.env.TOKEN || '123456';

app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

app.use('/api', (req, rsp, next) => {
    if(req.headers['authorization'] !== token){
        rsp.json(Result.noAuth());
        return;
    }
    next();
});

app.use('/api/db', dbRouter);

app.listen(3000, () => {
    console.log("token：" + token);
    console.log('port：3000');
});