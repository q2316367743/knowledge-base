import {defineStore} from "pinia";
import {getDefaultLskyOption, LskyAuth, LskyOption, LskyPro, ProfileResult} from "@/plugin/sdk/LskyPro";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";


export const useLskyProSettingStore = defineStore('lsky-pro-setting', {
    state: () => ({
        option: getDefaultLskyOption(),
        instance: new LskyPro(getDefaultLskyOption()),
        rev: undefined as string | undefined,
        profile: null as ProfileResult | null
    }),
    getters: {
        isAvailable: state => state.option.url.trim() != '',
        isLogin: state => state.option.url.trim() != '' && state.option.token.trim() != '',
        username: state => state.profile ? state.profile.name : '',
        avatar: state => state.profile ? state.profile.avatar : ''
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_LSKY_PRO, this.option);
            this.option = res.record;
            this.rev = res.rev;
            this.instance.setOption(this.option);
            if (this.instance.isLogin) {
                this.instance.profile()
                    .then(res => {
                        this.profile = res
                    });
            }
        },
        async _sync() {
            this.rev = await saveOneByAsync(LocalNameEnum.SETTING_LSKY_PRO, this.option, this.rev);
        },
        async login(auth: LskyAuth) {
            if (auth.url.trim() === '') {
                return Promise.reject("服务器地址必须输入");
            }
            let token: string = '';
            if (auth.token.trim() === '') {
                if (auth.email !== '' && auth.password !== '') {
                    token = await this.instance.login(auth);
                }
            }
            this.option = {
                ...this.option,
                ...auth,
                token
            };
            if (this.instance.isLogin) {
                this.instance.profile()
                    .then(res => {
                        this.profile = res
                    });
            }
            await this._sync();
        },
        async logout() {
            this.option = getDefaultLskyOption();
            await this._sync();
            this.profile = null;
        },
        async clearToken() {
            await this.instance.logout();
            this.option.token = '';
            this.profile = null;
        },
        async getProfile(): Promise<ProfileResult> {
            let profile = this.profile
            if (!profile) {
                profile = await this.instance.profile();
            }
            return profile;
        },
        async update(record: Partial<LskyOption>) {
            this.option = {
                ...this.option,
                ...record
            }
            await this._sync();
        },
        upload(file: Blob): Promise<string> {
            if (!this.isAvailable) {
                return Promise.reject("兰空图床不可用，无法上传")
            }
            return new Promise<string>((resolve, reject) => {
                this.instance.upload(file,
                    result => resolve(result.links.url),
                    message => reject(message));
            })
        }
    }
})
