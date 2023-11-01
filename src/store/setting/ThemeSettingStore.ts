import {defineStore} from "pinia";
import {getDefaultThemeSetting, ThemeSetting} from "@/entity/setting/ThemeSetting";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {StyleValue} from "vue";

export const useThemeSettingStore = defineStore('theme-setting', {
    state: () => ({
        themeSetting: getDefaultThemeSetting(),
        rev: undefined as undefined | string,
    }),
    getters: {
        backgroundImage: state => state.themeSetting.backgroundImage,
        enableBackgroundImage: state => state.themeSetting.backgroundImage !== '',
        customerImage: (state): StyleValue => {
            let style: Record<string, any> = {
                backgroundImage: `url(${state.themeSetting.backgroundImage})`,
                color: state.themeSetting.textColor,
                backgroundColor: state.themeSetting.bgColor,
            };
            if (!state.themeSetting.bgColor.startsWith('var')) {
                style['--color-bg-1'] = state.themeSetting.bgColor;
            }
            if (!state.themeSetting.textColor.startsWith('var')) {
                style['--color-text-1'] = state.themeSetting.textColor;
            }
            return style;
        },
        textColor: state => state.themeSetting.textColor,
        bgColor: state => state.themeSetting.bgColor
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_THEME, this.themeSetting);
            this.themeSetting = res.record;
            this.rev = res.rev;
        },
        async save(themeSetting: ThemeSetting) {
            this.themeSetting = themeSetting;
            this.rev = await saveOneByAsync(LocalNameEnum.SETTING_THEME, this.themeSetting, this.rev);
        },
    }
})
