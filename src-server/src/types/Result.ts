import {data} from "v-calendar/dist/types/tests/unit/util/dayData";

export class Result<T> {
    private readonly code: number;
    private readonly msg: string;
    private readonly data: T | null;

    constructor(code: number, msg: string, data: T | null) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public static  success<T>(data: T) {
        return new Result(200, "", data);
    }

    public static error(msg: string) {
        return new Result(500, msg, null);
    }

}
