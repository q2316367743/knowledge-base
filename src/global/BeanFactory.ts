// 状态管理
import {useFolderStore} from "@/store/db/FolderStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";

// utools注入
export const isUtools: boolean = true;

export const usePageJumpEvent = useEventBus<string>('page-jump');
export const useDeleteEvent = useEventBus('delete');
export const useSearchContentEvent = useEventBus('search-content');
export const useDbKeyRefreshEvent = useEventBus<string>('db-key-refresh');

// 首页的关键字
export const keyword = ref('');


export async function initData(): Promise<void> {
  // 在进行数据初始化
  await Promise.all([
    useBaseSettingStore().init(),
    useAiServiceStore().init(),
    useAiAssistantStore().init(),
    Promise.all([
      useThemeSettingStore().init(),
      usePluginSettingStore().init()])
      .then(useThemeSettingStore().buildThemeStyle),
    // 编辑器初始化，初始化时会同步初始化文章
    useHomeEditorStore().init(),
    useCategoryStore().init(),
    useFolderStore().init(),
    useTodoCategoryStore().init()
  ])
  return Promise.resolve();
}
