import {defineStore} from "pinia";
import BaseSetting from "@/entity/setting/BaseSetting";
import {useGlobalStore} from "@/store/GlobalStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";

export function getDefaultBaseSetting(): BaseSetting {
    return {
        codeLightTheme: 'github',
        codeDarkTheme: 'github-dark',
        articleTheme: ArticleThemeEnum.TAILWIND_BLUE,
        articleHeaderVisible: true,
        codeWrap: false,
        imageStrategy: ImageStrategyEnum.INNER
    }
}

export function renderHelp(theme: ArticleThemeEnum): string {
    if (theme === ArticleThemeEnum.HE_TI) {
        return `样式来源于<a class="arco-link" href="https://gitee.com/malinonce/heti" onclick="utools.shellOpenExternal('https://gitee.com/malinonce/heti')">赫蹏</a>`
    }
    return "";
}

export const useBaseSettingStore = defineStore('base-setting', {
    state: () => ({
        baseSetting: getDefaultBaseSetting(),
        rev: undefined as string | undefined
    }),
    getters: {
        codeTheme: (state) => {
            if (useGlobalStore().isDark) {
                return state.baseSetting.codeDarkTheme;
            } else {
                return state.baseSetting.codeLightTheme;
            }
        },
        articleTheme: state => state.baseSetting.articleTheme,
        articleHeaderVisible: state => state.baseSetting.articleHeaderVisible,
        codeWrap: state => state.baseSetting.codeWrap,
        imageStrategy: state => state.baseSetting.imageStrategy
    },
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.SETTING_BASE);
            if (res) {
                this.baseSetting = Object.assign(this.baseSetting, res.value);
                this.rev = res._rev;
            }
        },
        async save(baseSetting: BaseSetting) {
            this.baseSetting = baseSetting;
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_BASE,
                _rev: this.rev,
                value: toRaw(this.baseSetting)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        }
    }
})