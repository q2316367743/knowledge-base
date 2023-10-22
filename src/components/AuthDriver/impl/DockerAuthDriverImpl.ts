import {AuthDriver} from "@/components/AuthDriver/AuthDriver";
import {DbDoc} from "@/plugin/utools";
import axios, {AxiosInstance} from "axios";
import router from "@/plugin/router";
import MessageUtil from "@/utils/MessageUtil";

interface Result<T> {
    code: number;
    message: string;
    data: T;
}

export class DockerAuthDriverImpl implements AuthDriver {

    private readonly token: string;
    private readonly http: AxiosInstance

    constructor(token: string) {
        this.token = token;
        this.http = axios.create({
            headers: {
                authorization: this.token
            }
        });
        this.http.interceptors.response.use(
            (rsp) => {
                if (rsp.data.code === 403) {

                    router.push('/login').then(() => MessageUtil.error("token错误，请重新输入"));

                    return Promise.resolve(rsp);
                }
                return rsp
            })
    }

    allDocKeys(key?: string): Promise<Array<string>> {
        return this.http.get<Result<Array<string>>>('/api/db/allDocKeys',{
            params: {
                key: key
            }
        })
            .then(rsp => {
                if (rsp.data.code === 200) {
                    return rsp.data.data;
                } else {
                    return Promise.reject(rsp.data.message)
                }
            });
    }

    allDocs(key?: string): Promise<Array<DbDoc>> {
        return this.http.get<Result<Array<DbDoc>>>('/api/db/allDocs')
            .then(rsp => {
                if (rsp.data.code === 200) {
                    return rsp.data.data;
                } else {
                    return Promise.reject(rsp.data.message)
                }
            });
    }

    get(id: string): Promise<DbDoc | null> {
        return this.http.get<Result<DbDoc | null>>('/api/db/get', {
            params: {
                key: id
            }
        })
            .then(rsp => {
                if (rsp.data.code === 200) {
                    return rsp.data.data;
                } else {
                    return Promise.reject(rsp.data.message)
                }
            });
    }

    getAttachment(docId: string): Promise<string> {
        return Promise.resolve("./api/image/" + docId);
    }

    init(): Promise<void> {
        return Promise.resolve();
    }


    put(doc: DbDoc): Promise<DbReturn> {
        return this.http.post<Result<string | undefined>>('/api/db/put', doc)
            .then(rsp => {
                if (rsp.data.code === 200) {
                    return {
                        id: doc._id,
                        error: false,
                        ok: true,
                        rev: rsp.data.data
                    };
                } else {
                    return {
                        id: doc._id,
                        error: true,
                        ok: false,
                        message: rsp.data.message
                    }
                }
            });
    }

    postAttachment(docId: string, attachment: Blob): Promise<string> {
        const form = new FormData();
        form.set('docId', docId);
        form.set('file', attachment);
        return this.http.post<Result<string | undefined>>('/api/db/postAttachment', form)
            .then(rsp => {
                if (rsp.data.code === 200) {
                    return rsp.data.data + '';
                } else {
                    return Promise.reject(rsp.data.message)
                }
            });
    }

    remove(doc: string | DbDoc): Promise<DbReturn> {
        const _id = typeof doc === 'string' ? doc : doc._id;
        return this.http.delete<Result<void>>('/api/db/remove', {
            params: {
                key: _id
            }
        })
            .then(rsp => {
                if (rsp.data.code === 200) {
                    return {
                        id: _id,
                        error: false,
                        ok: true,
                    };
                } else {
                    return {
                        id: _id,
                        error: true,
                        ok: false,
                        message: rsp.data.message
                    }
                }
            });
    }

}
