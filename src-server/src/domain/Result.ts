export class Result<T> {

    private readonly code: number;
    private readonly message: string;
    private readonly data?: T;

    constructor(code: number, message: string, data?: T) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static success<T>(data?: T): Result<T> {
        return new Result(200, "success", data);
    }

    static fail<T>(message: string): Result<T> {
        return new Result(500, message);
    }

    static noAuth<T>(): Result<T> {
        return new Result(403, "no auth");
    }

}