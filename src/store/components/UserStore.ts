import {defineStore} from "pinia";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {InjectionUtil, UserProfile} from "@/utils/utools/InjectionUtil";


export const useUserStore = defineStore('user', () => {
  const profile = useUtoolsDbStorage<UserProfile>(LocalNameEnum.KEY_APP_USER, () => {
    const p = InjectionUtil.getUser();
    if (p) return p;
    return {
      avatar: '/logo.png',
      nickname: '未登录',
      type: 'user'
    }
  });

  function update(p: Partial<UserProfile>) {
    profile.value = {
      ...profile.value,
      ...p
    }
  }

  return {profile, update};
})