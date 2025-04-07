import {defineStore} from "pinia";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import {authInfo, authLogin, authUTools, UserLoginView} from "@/nested/feedback/apis/auth";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";

export const useFeedbackStore = defineStore('feedback', () => {
  // 0初始化中，1登录成功，2登录失败，3uTools未登录
  const status = ref(0);
  const token = useUtoolsKvStorage<string>(LocalNameEnum.KEY_COMPONENT_FEEDBACK_TOKEN, '');
  const info = useUtoolsDbStorage<UserLoginView>(LocalNameEnum.KEY_COMPONENT_FEEDBACK_USER_INFO, {});

  async function init() {
    if (status.value === 1) {
      return;
    }
    try {
      if (!utools.getUser()) {
        console.error("未登录uTools");
        status.value = 3;
        return;
      }
      // 如果存在token，尝试获取用户信息
      if (isNotEmptyString(token.value)) {
        try {
          info.value = await authInfo();
          status.value = 1;
          return;
        } catch (e) {
          console.error(e);
        }
      }
      // 重新登录
      const account = await authUTools();
      info.value = await authLogin(account);
      token.value = info.value.token || '';
      status.value = 1;
    } catch (e) {
      console.error("登录失败", e);
      status.value = 2;
    }
  }

  return {
    token, info, status,
    init
  }
})