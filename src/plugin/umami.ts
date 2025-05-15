import router from "@/plugin/router";
import Constants from "@/global/Constant";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

interface UmamiPayloadBase {
  hostname: string;
  language: string;
  referrer: string;
  screen: string;
  website: string;
  id: string|undefined;
}

interface UmamiPayload extends UmamiPayloadBase {
  title: string;
  url: string;
  // 事件名
  name?: string;
  // 事件附属数据
  data?: Record<string, string>;
}

function buildBasePayload(): UmamiPayloadBase {
  return {
    hostname: "u.block",
    language: navigator.language,
    referrer: "https://u.tools",
    screen: `${window.screen.width}x${window.screen.height}`,
    website: Constants.umami.id,
    id: InjectionUtil.getUser()?.nickname,
  }
}

function buildPayload(): UmamiPayload {
  const {path, name} = router.currentRoute.value;
  return {
    ...buildBasePayload(),
    title: `${name as string || document.title}`,
    url: path,
  }
}

const buildPathPayload = (path: string, name?: string): UmamiPayload => ({
  ...buildBasePayload(),
  url: path,
  title: name || document.title,
})

function sendEvent(payload: UmamiPayload) {
  if (InjectionUtil.isDev()) {
    console.debug('Umami payload:', payload);
    return;
  }
  fetch(`${Constants.umami.url}/api/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payload: payload,
      type: "event"
    })
  }).then(response => response.text())
    .then(text => console.debug('Umami response:', text))
    .catch(error => console.error('Umami error:', error))
}

let first = true;

export const useUmami = {
  // TODO: 此处要规范事件名称
  track(event?: string, data?: Record<string, string> | string): void {
    const payload: UmamiPayload = buildPayload()
    if (event) {
      payload.name = event;
    }
    if (typeof data === 'string') {
      payload.data = {value: data};
    } else if (data) {
      payload.data = data;
    }
    sendEvent(payload)
  },

  page(path: string, name?: string): void {
    const payload = buildPathPayload(path, name);
    if (first) {
      first = false;
      let type = '未登录'
      try {
        const user = InjectionUtil.getUser();
        if (user) {
          if (user.type === 'member') {
            type = 'uTools会员'
          } else {
            type = 'uTools用户'
          }
        }
      } catch (e) {
        console.error("获取用户信息失败", e);
      }
      payload.name = `/用户/类型/${type}`;
    }
    sendEvent(payload)
  }
}
