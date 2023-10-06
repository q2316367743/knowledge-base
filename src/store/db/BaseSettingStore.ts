import {defineStore} from "pinia";
import BaseSetting from "@/entity/setting/BaseSetting";
import {useGlobalStore} from "@/store/GlobalStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import HomeTypeEnum from "@/enumeration/HomeTypeEnum";
import {useAuthStore} from "@/store/components/AuthStore";

export function getDefaultBaseSetting(): BaseSetting {
    return {
        codeLightTheme: 'github',
        codeDarkTheme: 'github-dark',
        articleTheme: ArticleThemeEnum.TAILWIND_BLUE,
        articleHeaderVisible: true,
        codeWrap: false,
        imageStrategy: ImageStrategyEnum.INNER,
        homeType: HomeTypeEnum.DEFAULT
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
        imageStrategy: state => state.baseSetting.imageStrategy,
        homeType: state => state.baseSetting.homeType
    },
    actions: {
        async init() {
            const res = await useAuthStore().authDriver.get(LocalNameEnum.SETTING_BASE);
            if (res) {
                this.baseSetting = Object.assign(this.baseSetting, res.value);
                this.rev = res._rev;
            }else {
                this.baseSetting = getDefaultBaseSetting();
                this.rev = undefined;
            }
        },
        async save(baseSetting: BaseSetting) {
            this.baseSetting = baseSetting;
            const res = await useAuthStore().authDriver.put({
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
