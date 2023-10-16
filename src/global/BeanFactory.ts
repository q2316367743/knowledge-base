import Statistics from '@/plugin/Statistics';
import {useEventBus} from "@vueuse/core";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import {useZoneStore} from "@/store/db/ZoneStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useBackupSettingStore} from "@/store/db/BackupSettingStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {useAuthStore} from "@/store/components/AuthStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {utools} from "@/plugin/utools";

// utools注入
window.utools = window.utools || utools;
export const statistics = new Statistics()
export const useSearchEvent = useEventBus<void>('search');
export const useTodoAddArticleEvent = useEventBus<void>('todo-add-article');

export async function initData(needAuth: boolean = true): Promise<void> {
    if (needAuth) {
        // 先进行认证驱动
        await useAuthStore().init();
    }
    // 在进行数据初始化
    await Promise.all([
        useZoneStore().init(),
        useBaseSettingStore().init(),
        useArticleStore().init(),
        useCategoryStore().init(),
        useBackupSettingStore().init(),
        useFolderStore().init(),
        useTodoCategoryStore().init()
    ])
    return Promise.resolve();
}
