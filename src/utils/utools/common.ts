import axios from "axios";

export interface InjectionWebResult<T> {
  code: number;
  msg: string;
  data: T;
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});
