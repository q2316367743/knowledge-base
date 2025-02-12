import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ref} from "vue";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";

export enum GlobalType {
  DARK = 1,
  LIGHT = 2,
  AUTO = 3
}

export const useGlobalStore = defineStore('global', () => {
  const isDark = ref(utools.isDarkColors());
  const loading = ref(false);
  const loadingText = ref('');
  const globalType = ref(getItemByDefault<GlobalType>(LocalNameEnum.KEY_APP_THEME, GlobalType.AUTO));
  const privacy = useUtoolsKvStorage<number>(LocalNameEnum.KEY_PRIVACY, 0);

  function renderTheme(): boolean {
    if (globalType.value === GlobalType.AUTO) {
      return utools.isDarkColors();
    } else if (globalType.value === GlobalType.DARK) {
      return true;
    } else if (globalType.value === GlobalType.LIGHT) {
      return false;
    }
    return false;
  }

  function initDarkColors() {
    isDark.value = renderTheme()
    if (isDark.value) {
      // 设置为暗黑主题
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      // 恢复亮色主题
      document.body.removeAttribute('arco-theme');
    }
  }

  function switchDarkColors(type: GlobalType) {
    globalType.value = type;
    setItem(LocalNameEnum.KEY_APP_THEME, globalType.value);
    initDarkColors()
  }

  function startLoading(text?: string) { // 加载中.. 可以加载完成后自动关闭页面.. 不要忘
    loading.value = true;
    loadingText.value = text || '加载中...';
  }

  function closeLoading() {
    loading.value = false;
  }

  return {
    isDark, globalType, loading, loadingText, privacy,
    initDarkColors, switchDarkColors, startLoading, closeLoading
  }

});
