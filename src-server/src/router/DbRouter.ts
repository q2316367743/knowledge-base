import { Router } from "express";
import { MongoClient, Db } from "mongodb";
import { Result } from "../domain/Result";

const URL: string = process.env.URL || 'mongodb://192.168.31.31:27017';

const app = Router();
let db: Db;
MongoClient.connect(URL)
    .then(client => {
        db = client.db("knowledge-base");
        console.log("数据库初始化成功！");
    })
    .catch(e => {
        console.error("数据库初始化失败！");
        console.error(e);
        process.exit(1);
    })

app.get("/allDocKeys", async (req, res) => {
    const key: string = req.query.key as string || '';
    let query = {};
    if (key){
        query = { 'name': { $regex: new RegExp('^' + key) } };
    }

    const items = await db.collection('db').find(query, {
        projection: { id: 1 }
    }).toArray();
    res.json(Result.success(items.map(item => item.id)));
});

app.get("/allDocs", async (req, res) => {
    const key: string = req.query.key as string || '';
    let query = {};
    if (key){
        query = { 'name': { $regex: new RegExp('^' + key) } };
    }
    const items = await db.collection('db').find(query).toArray();
    res.json(Result.success(items.map(data => ({
        ...data.value,
        _id: data.id,
        _rev: data.rev,
    }))));
});

app.get('/get', (req, res) => {
    const key: string | undefined = req.query.key as string;
    if (!key) {
        res.json(Result.fail("key is required"));
        return;
    }
    db.collection('db').findOne({ id: key })
        .then(data => res.json(Result.success(data ? {
            ...data.value,
            _id: data.id,
            _rev: data.rev,
        } : null)))
        .catch(e => res.json(Result.fail(e.message)));
});

app.post('/put', async (req, res) => {
    const doc = req.body;
    if (!doc) {
        res.json(Result.fail("doc is required"));
        return;
    }
    if (!doc._id) {
        res.json(Result.fail("doc_id is required"));
        return;
    }
    const time = new Date().getTime();
    let version = 0;
    if (doc._rev) {
        const split = doc._rev.split("-");
        version = parseInt(split[0]);
    }

    // 查询版本
    const old = await db.collection('db').findOne({ id: doc._id });
    if (old) {
        const oldVersion = old.rev.split("-")[0];
        if (oldVersion > version) {
            res.json(Result.fail("Document update conflict"));
            return;
        }
    }


    db.collection('db')
        .updateOne({ id: doc._id },
            {
                $set: {
                    id: doc._id,
                    rev: (version + 1) + '-' + time,
                    value: doc
                }
            },
            { upsert: true })
        .then(() => res.json(Result.success()))
        .catch(e => res.json(Result.fail(e.message)));
});

app.delete('/remove', (req, res) => {
    const key: string | undefined = req.query.key as string;
    if (!key) {
        res.json(Result.fail("key is required"));
        return;
    }
    const id = key;
    db.collection('db').deleteOne({ id: id })
        .then(() => res.json(Result.success()))
        .catch(e => res.json(Result.fail(e.message)));
})

export default app;