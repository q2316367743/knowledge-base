import Statistics from '@/plugin/Statistics';
import {useEventBus} from "@vueuse/core";

export const statistics = new Statistics()
export const useSearchEvent = useEventBus<void>('search');
export const useImportEvent = useEventBus<string>('import');
