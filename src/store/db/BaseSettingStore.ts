import {defineStore} from "pinia";
import BaseSetting from "@/entity/setting/BaseSetting";
import {useGlobalStore} from "@/store/GlobalStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";

export function getDefaultBaseSetting(): BaseSetting {
    return {
        codeLightTheme: 'github',
        codeDarkTheme: 'github-dark',
        articleTheme: ArticleThemeEnum.TAILWIND_BLUE,
        articleHeaderVisible: true,
        codeWrap: false,
        imageStrategy: ImageStrategyEnum.INNER,
        autoCollapsedByEditor: true,
        autoCollapsedByTodo: true,
        newArticleTemplateByName: "新建文章 (yyyy/MM/DD)"
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
        autoCollapsedByEditor: state => state.baseSetting.autoCollapsedByEditor,
        autoCollapsedByTodo: state => state.baseSetting.autoCollapsedByTodo,
        newArticleTemplateByName: state => state.baseSetting.newArticleTemplateByName
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_BASE, getDefaultBaseSetting());
            this.baseSetting = res.record;
            this.rev = res.rev;
            if (Constant.platform == PlatformTypeEnum.WEB) {
                // web版只能用兰空图床
                this.baseSetting.imageStrategy = ImageStrategyEnum.LSKY_PRO;
            }
        },
        async save(baseSetting: BaseSetting) {
            this.baseSetting = baseSetting;
            this.rev = await saveOneByAsync(LocalNameEnum.SETTING_BASE, this.baseSetting, this.rev);
        }
    }
})
