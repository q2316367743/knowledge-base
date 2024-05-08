import axios from "axios";
import {utools} from "@/plugin/utools";
import Constant from "@/global/Constant";
import {getTokenThrow} from "@/plugin/Statistics";

export const instance = axios.create({
    baseURL: utools.isDev() ? 'http://localhost:8080' : '',
    timeout: 5000,
    headers: {
        'plugin-id': Constant.uid,
    }
});

instance.interceptors.request.use(async config => {
    if (config.url && config.url.startsWith("/plugin/script/user")) {
        // 需要token
        config.headers.set('access-token', await getTokenThrow())
    }
    return config
})
