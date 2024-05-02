import {ref} from "vue";
import {useEventBus} from "@vueuse/core";
import {utools} from '@/plugin/utools';
// 状态管理
import {useFolderStore} from "@/store/db/FolderStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useBackupSettingStore} from "@/store/db/BackupSettingStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {useImageSettingStore} from "@/store/setting/ImageSettingStore";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";

// utools注入
export const isUtools: boolean = typeof window.utools !== 'undefined'
window.utools = window.utools || utools;

export const usePageJumpEvent = useEventBus<string>('page-jump');
export const useNewEvent = useEventBus('new');
export const useDeleteEvent = useEventBus('delete');
export const useSearchContentEvent = useEventBus('search-content');

// 首页的关键字
export const keyword = ref('');


export async function initData(): Promise<void> {
    // 在进行数据初始化
    await Promise.all([
        useBaseSettingStore().init(),
        useLskyProSettingStore().init(),
        useImageSettingStore().init(),
        Promise.all([
            useThemeSettingStore().init(),
            usePluginSettingStore().init()])
            .then(useThemeSettingStore().buildThemeStyle),

        useArticleStore().init(),
        useCategoryStore().init(),
        useBackupSettingStore().init(),
        useFolderStore().init(),
        useTodoCategoryStore().init()
    ])
    return Promise.resolve();
}
