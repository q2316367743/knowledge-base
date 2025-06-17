import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defaultThemeSetting, ThemeSetting} from "@/entity/setting/ThemeSetting";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";

export const useThemeSettingStore = defineStore(LocalNameEnum.SETTING_THEME, () => {
  const theme = ref<ThemeSetting>(defaultThemeSetting());
  const rev = ref<string>();

  const init = async () => {
    const res = await getFromOneByAsync(LocalNameEnum.SETTING_THEME);
    console.log(res)
    if (res.record) theme.value = res.record;
    rev.value = res.rev;
  }

  const update = async (res: Partial<ThemeSetting>) => {
    theme.value = {
      ...theme.value,
      ...res
    };
    rev.value = await saveOneByAsync(LocalNameEnum.SETTING_THEME, theme.value, rev.value);
  }

  return {theme, init, update};

})