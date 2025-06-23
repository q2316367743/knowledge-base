export class Result<T>{
  code: number;
  msg: string;
  data: T;
  
  constructor(code: number, msg: string, data: T) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  public static success<T>(data: T) {
    return new Result<T>(200, 'success', data);
  }

  public static error(msg: string) {
    return new Result<null>(500, msg, null);
  }

  public static errorWithData<T>(msg: string, data: T) {
    return new Result<T>(500, msg, data);
  }

}