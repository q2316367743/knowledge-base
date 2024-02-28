import {defineStore} from "pinia";
import BaseSetting from "@/entity/setting/BaseSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import dayjs from "dayjs";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

export function getDefaultBaseSetting(): BaseSetting {
    return {
        articleTheme: ArticleThemeEnum.TAILWIND_BLUE,
        imageStrategy: ImageStrategyEnum.INNER,
        autoCollapsedByEditor: true,
        autoCollapsedByTodo: true,
        newArticleTemplateByName: "[新建文章] (YYYY/MM/DD HH:mm)",
        codeExtraName: 'ts',
        mdEditorEditMode: MdEditorEditModeEnum.AUTO
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
        articleTheme: state => state.baseSetting.articleTheme,
        imageStrategy: state => state.baseSetting.imageStrategy,
        autoCollapsedByEditor: state => state.baseSetting.autoCollapsedByEditor,
        autoCollapsedByTodo: state => state.baseSetting.autoCollapsedByTodo,
        newArticleTemplateByName: state => state.baseSetting.newArticleTemplateByName,
        codeExtraName: state => state.baseSetting.codeExtraName,
        mdEditorAutoMode: (state): boolean => state.baseSetting.mdEditorEditMode === MdEditorEditModeEnum.AUTO,
        defaultModel: (state): 'editOnly' | 'edit&preview' => {
            switch (state.baseSetting.mdEditorEditMode) {
                case MdEditorEditModeEnum.EDIT_ONLY:
                    return 'editOnly';
                case MdEditorEditModeEnum.EDIT_PREVIEW:
                    return 'edit&preview';
                default:
                    if (window.innerWidth > Constant.autoCollapsedWidth) {
                        return 'edit&preview';
                    }
                    return 'editOnly';
            }
        }
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
});

export function buildArticleName(type: ArticleTypeEnum): string {
    const name = dayjs().format(useBaseSettingStore().newArticleTemplateByName);
    if (type === ArticleTypeEnum.CODE) {
        return `${name}.${useBaseSettingStore().codeExtraName}`;
    }
    return name;
}
