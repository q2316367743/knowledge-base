import {Router} from "express";
import {Result} from "../global/Result";
import {Database} from "sqlite3";
import {DbRecord} from "../global/DbRecord";
import {TABLE_NAME} from "../global/Constant";

export default function buildDbController(db: Database): Router {

    const app = Router();


    app.get('/get', (req, rsp) => {
        const {_id} = req.query;
        if (!_id) {
            rsp.json(Result.error("ID不存在"));
            return;
        }

        db.get<DbRecord>(`select * from ${TABLE_NAME} where id = '${_id}'`, (e, record) => {
            if (e) {
                rsp.json(Result.error(e.message));
                return;
            }
            if (record) {
                rsp.json(Result.success({
                    _id: record.id,
                    _rev: record.rev,
                    value: JSON.parse(record.val).value
                }));
            } else {
                rsp.json(Result.success(record));
            }
        });

    });

    app.post('/set', (req, rsp) => {
        const {_id, _rev} = req.body;


        db.get<DbRecord>(`select * from ${TABLE_NAME} where id = '${_id}'`, (e, record) => {
            if (e) {
                rsp.json(Result.error(e.message));
                return;
            }
            let feature = 1;
            let sql = "";
            if (record) {
                // 存在记录
                const rev = parseInt(record.rev);
                if (!_rev) {
                    rsp.json(Result.error("不存在_rev"));
                    return;
                }
                const now = parseInt(_rev);
                if (rev > now) {
                    rsp.json(Result.error("数据已过期"));
                    return;
                }
                feature = now + 1;
                sql = `update ${TABLE_NAME} set rev = '${feature}', val = '${JSON.stringify(req.body)}' where id = '${_id}';`
            } else {
                sql = `insert into ${TABLE_NAME} values ('${_id}', '${feature}', '${JSON.stringify(req.body)}');`;
            }


            // 直接保存
            db.run(sql, (e) => {
                if (e) {
                    rsp.json(Result.error(e.message));
                    return;
                }
                rsp.json(Result.success(null));
            });
        });
    })

    app.delete('/delete', (req, rsp) => {
        const {_id} = req.query;
        db.run(`delete from ${TABLE_NAME} where id = ${_id}`, (e) => {
            if (e) {
                rsp.json(Result.error(e.message));
                return;
            }
            rsp.json(Result.success(null));
        });
    });

    return app;

}

