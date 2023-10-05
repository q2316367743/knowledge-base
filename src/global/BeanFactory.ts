import Statistics from '@/plugin/Statistics';
import {useEventBus} from "@vueuse/core";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import {useZoneStore} from "@/store/db/ZoneStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useBackupSettingStore} from "@/store/db/BackupSettingStore";
import {useFolderStore} from "@/store/db/FolderStore";

export const statistics = new Statistics()
export const useSearchEvent = useEventBus<void>('search');
export const useImportEvent = useEventBus<string>('import');

export async function initData(): Promise<void> {
    await Promise.all([
        useZoneStore().init(),
        useBaseSettingStore().init(),
        useArticleStore().init(),
        useCategoryStore().init(),
        useBackupSettingStore().init(),
        useFolderStore().init()
    ])
    return Promise.resolve();
}
