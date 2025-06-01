export const activeKey = useSessionStorage('/session/home/active-key', '/home/welcome');
export const collapsed = useSessionStorage('/session/home/collapsed', false);


export const toggleCollapsed = useToggle(collapsed);

export const renderActiveKey = (key: string) => {
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