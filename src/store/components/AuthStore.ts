import {defineStore} from "pinia";
import {Auth, AuthType, getDefaultAuth} from "@/entity/auth";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import {UtoolsAuthDriverImpl} from "@/components/AuthDriver/impl/UtoolsAuthDriverImpl";
import {AuthDriver} from "@/components/AuthDriver/AuthDriver";
import MessageUtil from "@/utils/MessageUtil";
import {initData} from "@/global/BeanFactory";
import {AlistAuthDriverImpl} from "@/components/AuthDriver/impl/AlistAuthDriverImpl";

/**
 * 获取认证驱动
 * @param auth 认证信息
 */
async function getAuthDriver(auth: Auth): Promise<AuthDriver> {
    let driver: AuthDriver;
    switch (auth.type) {
        case AuthType.ALIST:
            driver = new AlistAuthDriverImpl(auth);
            break;
        case AuthType.LOCATION:
            // TODO: 本地
            driver = new UtoolsAuthDriverImpl();
            break;
        case AuthType.UTOOLS:
            driver = new UtoolsAuthDriverImpl();
            break;
        case AuthType.WEBDAV:
            // TODO: WebDAV
            driver = new UtoolsAuthDriverImpl();
            break;
        default:
            MessageUtil.error("系统异常，未找到对应的认证驱动。将使用utools存储数据");
            driver = new UtoolsAuthDriverImpl();
    }
    await driver.init();
    return driver;
}

// 是否初始化
let init = false;

// key
const KEY = LocalNameEnum.AUTH + utools.getNativeId()

export const useAuthStore = defineStore('auth', {
    state: () => ({
        auth: getDefaultAuth(),
        rev: undefined as string | undefined,
        need: true,
        authDriver: new UtoolsAuthDriverImpl() as AuthDriver
    }),
    actions: {
        async init() {
            if (init) {
                // 已经初始化过
                return;
            }
            init = true;
            const res = await utools.db.promises.get(KEY);
            if (res) {
                this.need = false;
                this.auth = Object.assign(this.auth, res.value);
                this.rev = res._rev;
                this.authDriver = await getAuthDriver(this.auth);
            }
        },
        async save(auth: Auth) {
            this.auth = auth;
            const res = await utools.db.promises.put({
                _id: KEY,
                _rev: this.rev,
                value: toRaw(this.auth)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
            // 驱动
            this.authDriver = await getAuthDriver(this.auth);
            // 重新初始化数据
            await initData(false);
        },
    }
})
