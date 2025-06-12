import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export enum GlobalType {
  DARK = 1,
  LIGHT = 2,
  AUTO = 3
}

export const useGlobalStore = defineStore('global', () => {
  const isDark = ref(InjectionUtil.isDarkColors());
  const globalType = ref(getItemByDefault<GlobalType>(LocalNameEnum.KEY_APP_THEME, GlobalType.AUTO));
  const themeColor = useUtoolsDbStorage<string>(LocalNameEnum.KEY_APP_COLOR, 'ghibli');

  function renderTheme(): boolean {
    if (globalType.value === GlobalType.AUTO) {
      return InjectionUtil.isDarkColors();
    } else if (globalType.value === GlobalType.DARK) {
      return true;
    } else if (globalType.value === GlobalType.LIGHT) {
      return false;
    }
    return false;
  }

  function initDarkColors() {
    isDark.value = renderTheme();
    if (isDark.value) {
      // 设置为暗黑主题
      document.body.setAttribute('arco-theme', 'dark');
      document.documentElement.setAttribute('theme-mode', 'dark');
    } else {
      // 恢复亮色主题
      document.body.removeAttribute('arco-theme');
      document.documentElement.removeAttribute('theme-mode');
    }
  }

  function switchDarkColors(type: GlobalType) {
    globalType.value = type;
    setItem(LocalNameEnum.KEY_APP_THEME, globalType.value);
    initDarkColors()
  }

  return {
    isDark, globalType, themeColor,
    initDarkColors, switchDarkColors
  }

});
