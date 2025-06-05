import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export const activeKey = ref('/home/welcome');
export const collapsed = ref(false);


export const toggleCollapsed = useToggle(collapsed);

export const model = useUtoolsKvStorage<string>(LocalNameEnum.KEY_HOME_MODEL, "1/doubao-1.5-pro-32k");

export const renderChat = (key: string) => {
  const s = Array.from(key.matchAll(/\d+/g));
  const groupId = s[0][0];
  const chatId = s[1][0];
  return {groupId, chatId};
}

export const renderModel = (key: string) => {
  const split = key.split('/');
  return {
    aiServiceId: split[0],
    model: split.slice(1).join("/")
  };
}

export const renderGroup = (key: string) => {
  const s = Array.from(key.matchAll(/\d+/g));
  return s[0][0];

}