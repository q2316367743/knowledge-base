import axios from "axios";
import router from "@/plugin/router";

interface InjectionWebResult<T> {
  code: number;
  msg: string;
  data: T;
}

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});


type PlatformType = 'uTools' | 'web' | 'tauri';

export const getPlatform = (): PlatformType => import.meta.env.VITE_PLATFORM;

export async function requestRemoteApi<T = any>(module: string, func: string, body?: Record<string, any>): Promise<T> {
  const res = await http.post<InjectionWebResult<T>>(`/${module}/${func}`, body);
  const {code, msg, data} = res.data;
  if (code === 200) {
    return data;
  } else if (code === 401) {
    await router.push("/login");
  }
  return Promise.reject(new Error(msg));
}