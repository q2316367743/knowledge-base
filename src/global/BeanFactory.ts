import Statistics from '@/plugin/Statistics';
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useBackupSettingStore} from "@/store/db/BackupSettingStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {utools} from "@/plugin/utools";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {useWorkspaceSettingStore} from "@/store/setting/WorkspaceSettingStore";

// utools注入
export const isUtools: boolean = typeof window.utools !== 'undefined'
window.utools = window.utools || utools;


export const statistics = new Statistics()



export async function initData(): Promise<void> {
    // 在进行数据初始化
    await Promise.all([
        useThemeSettingStore().init(),
        useBaseSettingStore().init(),
        useLskyProSettingStore().init(),
        useWorkspaceSettingStore().init(),

        useArticleStore().init(),
        useCategoryStore().init(),
        useBackupSettingStore().init(),
        useFolderStore().init(),
        useTodoCategoryStore().init()
    ])
    return Promise.resolve();
}
