import axios from "axios";
import Constant from "@/global/Constant";
import {getTokenThrow} from "@/plugin/sdk/statistics";

export const instance = axios.create({
    baseURL: 'https://utools.esion.xyz',
    timeout: 5000,
    headers: {
        'plugin-id': Constant.uid,
    }
});

instance.interceptors.request.use(async config => {
    if (config.url && config.url.startsWith("/open/script/user")) {
        // 需要token
        config.headers.set('access-token', await getTokenThrow())
    }
    return config
})
