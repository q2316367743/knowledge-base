import {defineStore} from "pinia";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {InjectionUtil, UserProfile} from "@/utils/utools/InjectionUtil";


export const useUserStore = defineStore('user', () => {
  const profile = useUtoolsDbStorage<UserProfile>(LocalNameEnum.KEY_APP_USER, () => {
    const p = InjectionUtil.getUser();
    if (p) return p;
    return {
      avatar: '/user.png',
      nickname: '匿名用户',
      type: 'user'
    } as UserProfile
  });

  function rename(nickname: string) {
    profile.value.nickname = nickname;
  }

  return {profile, rename};
})