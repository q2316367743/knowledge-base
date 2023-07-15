import {defineStore} from "pinia";
import Setting from "@/entity/Setting";

export function getDefaultSetting(): Setting {
    return {
        codeLightTheme: 'github',
        codeDarkTheme: 'github-dark'
    }
}

export const useSettingStore = defineStore('setting', {
    state: () => ({
        setting: getDefaultSetting()
    }),
    getters: {
        codeLightTheme: state => state.setting.codeLightTheme,
        codeDarkTheme: state => state.setting.codeDarkTheme
    }
})
