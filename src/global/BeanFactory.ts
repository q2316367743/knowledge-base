// 状态管理
import {useFolderStore} from "@/store/db/FolderStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";

export const usePageJumpEvent = useEventBus<string>('page-jump');
export const useDeleteEvent = useEventBus('delete');

// 首页的关键字
export const keyword = ref('');

export async function initData(): Promise<void> {
  // 在进行数据初始化
  await Promise.all([
    useBaseSettingStore().init(),
    useAiServiceStore().init(),
    useAiAssistantStore().init(),
    // 编辑器初始化，初始化时会同步初始化笔记
    useHomeEditorStore().init(),
    useCategoryStore().init(),
    useFolderStore().init(),
    useTodoCategoryStore().init()
  ])
}
