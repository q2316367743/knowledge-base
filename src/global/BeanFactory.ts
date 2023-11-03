import Statistics from '@/plugin/Statistics';
import {useEventBus} from "@vueuse/core";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import {useZoneStore} from "@/store/db/ZoneStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useBackupSettingStore} from "@/store/db/BackupSettingStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {utools} from "@/plugin/utools";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {ConvertDriver} from "@/components/AuthDriver/ConvertDriver";
import UtoolsConvertDriver from "@/components/AuthDriver/convert/UtoolsConvertDriver";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import {tauri} from "@/plugin/sdk/tauri";

// utools注入
export const isUtools: boolean = typeof window.utools !== 'undefined'
window.utools = window.utools || utools;

if (Constant.platform === PlatformTypeEnum.TAURI) {
    window.utools = {
        ...window.utools, ...tauri
    } as any;
}

export const statistics = new Statistics()
export const useSearchEvent = useEventBus<void>('search');
export const useTodoAddArticleEvent = useEventBus<void>('todo-add-article');

let convertDriver: ConvertDriver = new UtoolsConvertDriver();

export const convert = convertDriver;

export async function initData(): Promise<void> {
    // 在进行数据初始化
    await Promise.all([
        useZoneStore().init(),
        useThemeSettingStore().init(),
        useBaseSettingStore().init(),
        useLskyProSettingStore().init(),
        useArticleStore().init(),
        useCategoryStore().init(),
        useBackupSettingStore().init(),
        useFolderStore().init(),
        useTodoCategoryStore().init()
    ])
    return Promise.resolve();
}
