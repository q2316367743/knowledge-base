import {defineStore} from "pinia";
import {getDefaultThemeSetting, ThemeSetting} from "@/entity/setting/ThemeSetting";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref, StyleValue} from "vue";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";

export const useThemeSettingStore = defineStore(LocalNameEnum.SETTING_THEME, () => {
    const themeSetting = ref(getDefaultThemeSetting());
    let rev: string | undefined = undefined;

    const markdownMenus = computed(() => themeSetting.value.markdownMenus);
    const markdownSyntaxes = computed(() => themeSetting.value.markdownSyntaxes);

    const style = document.createElement('style');
    style.setAttribute("data-custom-theme", "true");
    style.setAttribute("type", "text/css");
    style.setAttribute('id', 'custom-theme');

    console.log('load theme style')
    document.head.appendChild(style);

    async function init(): Promise<void> {
        const data = await getFromOneWithDefaultByAsync<ThemeSetting>(LocalNameEnum.SETTING_THEME, themeSetting.value);
        themeSetting.value = Object.assign(themeSetting.value, data.record);
        rev = data.rev;
    }

    async function save(res: ThemeSetting): Promise<void> {
        themeSetting.value = res;
        rev = await saveOneByAsync(LocalNameEnum.SETTING_THEME, themeSetting.value, rev);
        buildThemeStyle();
    }

    function buildThemeStyle() {
        const {getThemeContent} = usePluginSettingStore();

        getThemeContent(themeSetting.value.theme).then(content => {
            style.innerHTML = content;
        });
    }

    return {
        themeSetting, markdownMenus, markdownSyntaxes,
        init, save, buildThemeStyle
    }

})
