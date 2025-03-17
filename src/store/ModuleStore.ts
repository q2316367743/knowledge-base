import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";


// 资讯模块是否启用
export const moduleForAi = useUtoolsDbStorage<boolean>(LocalNameEnum.MODULE_AI, true);
export const moduleForNews = useUtoolsDbStorage<boolean>(LocalNameEnum.MODULE_NEWS, false);