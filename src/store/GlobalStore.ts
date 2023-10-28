import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export enum GlobalType {
    DARK = 1,
    LIGHT = 2,
    AUTO = 3
}

function renderTheme(): boolean {
    const globalType = getItemByDefault<GlobalType>(LocalNameEnum.KEY_APP_THEME, GlobalType.AUTO);
    if (globalType === GlobalType.AUTO) {
        return utools.isDarkColors();
    } else if (globalType === GlobalType.DARK) {
        return true;
    } else if (globalType === GlobalType.LIGHT) {
        return false;
    }
    return false;
}

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        loading: false,
        loadingText: '',
    }),
    actions: {
        /**
         * 初始化主题、重置主题
         */
        initDarkColors() {
            this.isDark = renderTheme()
            if (this.isDark) {
                // 设置为暗黑主题
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                // 恢复亮色主题
                document.body.removeAttribute('arco-theme');
            }
        },
        /**
         * 切换主题
         */
        switchDarkColors(type: GlobalType) {
            setItem(LocalNameEnum.KEY_APP_THEME, type);
            this.isDark = renderTheme()
            if (this.isDark) {
                // 设置为暗黑主题
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                // 恢复亮色主题
                document.body.removeAttribute('arco-theme');
            }
        },
        startLoading(text?: string) { // 加载中.. 可以加载完成后自动关闭页面.. 不要忘
            this.loading = true;
            this.loadingText = text || '加载中...';
        },
        closeLoading() {
            this.loading = false;
        }
    }
})
