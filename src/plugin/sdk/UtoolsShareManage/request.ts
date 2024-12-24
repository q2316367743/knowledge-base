import axios from "axios";
import Constant from "@/global/Constant";

export const instance = axios.create({
  baseURL: 'https://utools.esion.xyz',
  timeout: 5000,
  headers: {
    'plugin-id': Constant.uid,
  }
});

instance.interceptors.request.use(async config => {
  return config
})
