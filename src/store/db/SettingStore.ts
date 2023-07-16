import {defineStore} from "pinia";
import Setting from "@/entity/Setting";
import {useGlobalStore} from "@/store/GlobalStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";

export function getDefaultSetting(): Setting {
    return {
        codeLightTheme: 'github',
        codeDarkTheme: 'github-dark',
        articleTheme: ArticleThemeEnum.ZUI
    }
}

export function renderHelp(theme: ArticleThemeEnum): string {
    if (theme === ArticleThemeEnum.HE_TI) {
        return `样式来源于<a class="arco-link" href="https://gitee.com/malinonce/heti" onclick="utools.shellOpenExternal('https://gitee.com/malinonce/heti')">赫蹏</a>`
    }
    return "";
}

export const useSettingStore = defineStore('setting', {
    state: () => ({
        setting: getDefaultSetting(),
        rev: undefined as string | undefined
    }),
    getters: {
        codeTheme: (state) => {
            if (useGlobalStore().isDark) {
                return state.setting.codeLightTheme;
            } else {
                return state.setting.codeDarkTheme;
            }
        },
        articleTheme: state => state.setting.articleTheme
    },
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.SETTING_BASE);
            if (res) {
                this.setting = Object.assign(this.setting, res.value);
                this.rev = res._rev;
            }
        },
        async save(setting: Setting) {
            this.setting = setting;
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_BASE,
                _rev: this.rev,
                value: toRaw(this.setting)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        }
    }
})
