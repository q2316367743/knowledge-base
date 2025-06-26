import MessageUtil from "@/utils/modal/MessageUtil";
import {randomString, versionGreaterEqual} from "@/utils/lang/FieldUtil";
import {AiService, AiServiceType, InnerAiService} from "@/entity/ai/AiService";
import {openPayInGoodFaith} from "@/utils/utools/UtoolsModel";
import {getPlatform, requestRemoteApi} from '@/utils/utools/common';
import {pictureDir, tempDir} from '@tauri-apps/api/path';
import {getCurrentWindow} from '@tauri-apps/api/window';
import {load, Store} from '@tauri-apps/plugin-store';
import {writeText} from '@tauri-apps/plugin-clipboard-manager';
import {openUrl} from '@tauri-apps/plugin-opener';

type InjectionDbDoc<T extends {} = Record<string, any>> = {
  _id: string,
  _rev?: string,
} & T

interface InjectionDbReturn {
  id: string,
  rev?: string,
  ok?: boolean,
  error?: boolean,
  name?: string,
  message?: string
}

const DEFAULT_AI_SERVICE: AiService = {
  id: '1',
  createBy: 0,
  updateBy: 0,
  name: 'uTools服务',
  type: AiServiceType.U_TOOLS,
  url: '',
  key: '',
  modelVersion: '',
  models: [],
}

interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content?: string;
  // 思考内容
  reasoning_content?: string;
}

interface AiChatTool {
  type: "function";
  function?: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
    };
    required?: string[];
  };
}

interface AiChatOption {
  model?: string;
  messages: AiChatMessage[];
  tools?: AiChatTool[];
}

interface AiChatResult<T> extends Promise<T> {
  abort(): void;
}

interface OpenPaymentOptions {
  goodsId: string,
  outOrderId?: string,
  attach?: string
}

export interface UserProfile {
  id: string;
  avatar: string;
  nickname: string;
  type: 'member' | 'user';
}

export interface BaseEvent<T> {
  code: string,
  type: string,
  payload: T
}

export interface SelectEvent<T> extends BaseEvent<T> {
  option: MainPushResult
}

export interface MainEvent<T, L> extends BaseEvent<T> {
  option: L,
  from?: PluginEnterFrom
}

export type MainPushCallback<T> = (action: BaseEvent<T>) => MainPushResultList;
export type MainPushSelectCallback<T> = (action: SelectEvent<T>) => void;

function shellOpenExternal(url: string): void {
  switch (getPlatform()) {
    case "uTools":
      utools.shellOpenExternal(url);
      break;
    case "tauri":
      openUrl(url).catch(console.error);
      break;
    default:
      window.open(url, '_blank');
  }
}

let store: Store | null = null;
const getStore = async (): Promise<Store> => {
  if (!store) {
    store = await load('database/store.json', {autoSave: true});
  }
  return store;
}

export const InjectionUtil = {
  getPlatform: getPlatform,
  getUser(): UserProfile | null {
    if (window['utools']) {
      const u = utools.getUser();
      if (u) {
        return {
          ...u,
          id: u.nickname
        } as UserProfile
      }
    }
    return null;
  },
  copyText(text: string) {
    (async () => {
      switch (getPlatform()) {
        case "uTools":
          return utools.copyText(text)
        case "web":
          await navigator.clipboard.writeText(text);
          return true;
        case "tauri":
          await writeText(text);
          return true;
        default:
          throw new Error("环境异常");
      }
    })().then(r => {
      if (r) {
        MessageUtil.success("已复制到剪切板");
      } else {
        MessageUtil.error("复制失败");
      }
    }).catch(e => MessageUtil.error("复制异常", e));
  },
  shellOpenExternal: shellOpenExternal,
  getCursorScreenPoint(): { x: number, y: number } {
    if (window['utools']) {
      return utools.getCursorScreenPoint();
    } else {
      return {x: 0, y: 0};
    }
  },
  screenCapture(callback: (imgBase64: string) => void): void {
    if (getPlatform() === 'uTools') {
      utools.screenCapture(callback);
    }
  },
  isDarkColors(): boolean {
    return window['utools'] ? utools.isDarkColors() : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  redirect(label: string | string[], payload: string | { type: 'text' | 'img' | 'files', data: any }): boolean {
    switch (getPlatform()) {
      case "uTools":
        return utools.redirect(label, payload);
      case "tauri":
        openUrl(label as string).catch(console.error);
        return true;
      default:
        window.open(`utools://${label[0]}/${label[1]}?${payload}`);
        return true;

    }
  },
  path: {
    picture: async () => {
      switch (getPlatform()) {
        case "uTools":
          return utools.getPath('pictures');
        case "tauri":
          return pictureDir();
        default:
          return Promise.reject(new Error("环境异常"))
      }
    },
    temp: async () => {
      switch (getPlatform()) {
        case "uTools":
          return utools.getPath('temp');
        case "tauri":
          return tempDir();
        default:
          return Promise.reject(new Error("环境异常"))
      }
    }
  },
  window: {
    showMainWindow: async () => {
      switch (getPlatform()) {
        case 'uTools':
          return utools.showMainWindow();
        case 'tauri':
          const w = getCurrentWindow();
          await w.show();
          return true;
        default:
          return false;
      }
    },
    hideMainWindow: async () => {
      switch (getPlatform()) {
        case 'uTools':
          return utools.hideMainWindow();
        case 'tauri':
          const w = getCurrentWindow();
          await w.hide();
          return true;
        default:
          return false;
      }
    },
    getWindowType(): 'main' | 'detach' | 'browser' {
      return window['utools'] ? utools.getWindowType() : 'detach';
    },
    outPlugin: async (isKill?: boolean): Promise<boolean> => {
      switch (getPlatform()) {
        case 'uTools':
          return utools.outPlugin(isKill);
        case 'tauri':
          const w = getCurrentWindow();
          await w.close();
          return true;
        default:
          window.close();
          return true;
      }
    },
  },
  dbStorage: {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem(key: string, value: any): void {
      if (window['utools']) {
        return utools.dbStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify({
          value
        }));
      }
    },
    /**
     * 获取键名对应的值
     */
    getItem<T = any>(key: string): T | null {
      if (window['utools']) {
        return utools.dbStorage.getItem<T>(key);
      } else {
        const item = localStorage.getItem(key);
        if (item) {
          return JSON.parse(item).value;
        } else {
          return null;
        }
      }

    },
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void {
      if (window['utools']) {
        return utools.dbStorage.removeItem(key);
      } else {
        localStorage.removeItem(key);
      }
    }
  },
  db: {
    async put(doc: InjectionDbDoc): Promise<InjectionDbReturn> {
      switch (getPlatform()) {
        case "uTools":
          return utools.db.promises.put(doc);
        case "web":
          return requestRemoteApi<InjectionDbReturn>('db', 'put', {
            key: doc._id,
            value: doc
          })
        case "tauri":
          const s = await getStore();
          // 获取旧的数据
          const old = await s.get<InjectionDbDoc>(doc._id);
          // 新的版本
          let version = 1;
          if (old) {
            const {_rev} = old;
            if (_rev) {
              version = parseInt(_rev.split('-')[0]) + 1;
            }
          }

          let {_id, _rev} = doc;
          if (version > 1) {
            if (!_rev) {
              console.log(version, doc)
              return {
                id: _id,
                error: true,
                message: 'Document update conflict'
              };
            }
            const oldVersion = parseInt(_rev.split('-')[0]);
            if (oldVersion >= version) {
              console.log(version, oldVersion, old?._rev, _rev);
              return {
                id: _id,
                error: true,
                message: 'Document update conflict'
              };
            }
          }
          _rev = version + '-' + randomString(32);
          await s.set(doc._id, {...doc, _rev});
          return {
            id: doc._id,
            rev: _rev,
            ok: true
          }
      }
    },
    async get(id: string): Promise<InjectionDbDoc | null> {
      switch (getPlatform()) {
        case "uTools":
          return utools.db.promises.get(id);
        case "web":
          return requestRemoteApi<InjectionDbDoc>('db', 'get', {
            key: id,
          })
        case "tauri":
          const s = await getStore();
          const v = await s.get<InjectionDbDoc>(id);
          return v || null;
      }
    },
    async remove(doc: string | InjectionDbDoc): Promise<InjectionDbReturn> {
      switch (getPlatform()) {
        case "uTools":
          return utools.db.promises.remove(doc);
        case "web":
          const key = typeof doc === 'string' ? doc : doc._id;
          return requestRemoteApi<InjectionDbReturn>('db', 'delete', {
            key: key,
          })
        case 'tauri':
          const s = await getStore();
          const id = typeof doc === 'string' ? doc : doc._id;
          try {
            const res = await s.delete(id);
            return {
              id,
              ok: res,
              error: !res
            }
          } catch (e) {
            return {
              id,
              ok: false,
              error: true,
              message: e instanceof Error ? e.message : `${e}`
            }
          }
      }
    },
    async allDocs(key?: string): Promise<InjectionDbDoc[]> {
      switch (getPlatform()) {
        case "uTools":
          return utools.db.promises.allDocs(key);
        case "web":
          return requestRemoteApi<Array<InjectionDbDoc>>('db', 'all-docs', {key});
        case "tauri":
          const s = await getStore();
          let keys = await s.keys();
          if (key) {
            keys = keys.filter(k => k.startsWith(key));
          }
          const res = await Promise.all(keys.map(k => s.get<InjectionDbDoc>(k)));
          return res.filter(v => !!v) as InjectionDbDoc[];
      }
    },
  },
  env: {
    isSupportAi(): boolean {
      if (getPlatform() === 'uTools') {
        return versionGreaterEqual(utools.getAppVersion(), 7)
      } else {
        return false
      }
    },
    isSupportMarkdown(): boolean {
      switch (getPlatform()) {
        case "uTools":
          return versionGreaterEqual(utools.getAppVersion(), 7)
        case "web":
          return true;
        case "tauri":
          // TODO: tauri支持markdown
          return false;
      }
    },
    isUtools: () => getPlatform() === 'uTools',
    isWeb: () => getPlatform() === 'web',
    isTauri: () => getPlatform() === 'tauri',
    isDev: () => getPlatform() === 'uTools' ? utools.isDev() : import.meta.env.DEV
  },
  ai: {
    async service(): Promise<InnerAiService | null> {
      if (getPlatform() == 'uTools') {
        const models = await utools.allAiModels();
        return {
          ...DEFAULT_AI_SERVICE,
          updateBy: Date.now(),
          models
        }
      } else {
        return null;
      }
    },
    chat(option: AiChatOption, streamCallback: (chunk: AiChatMessage) => void): AiChatResult<void> {
      if (getPlatform()) {
        return utools.ai(option, streamCallback);
      }
      throw new Error("不支持内置AI服务");
    }
  },
  payment: {
    open(options: OpenPaymentOptions, callback?: () => void): void {
      switch (getPlatform()) {
        case 'uTools':
          utools.openPayment(options, callback);
          return;
        case "web":
          openPayInGoodFaith().then(() => {
            requestRemoteApi('payment', 'save', {
              goodId: options.goodsId
            }).then(() => callback?.())
          }).catch(() => MessageUtil.warning("取消支付"))
          return;
        case "tauri":
          throw new Error("tauri不支持支付功能");
      }
    },
    // 获取全部的订单ID
    async fetch(): Promise<Array<string>> {
      switch (getPlatform()) {
        case "uTools":
          return utools.fetchUserPayments().then(res => res.map(e => e.goods_id));
        case 'web':
          return requestRemoteApi<Array<string>>('payment', "list");
        case "tauri":
          return [];
      }
    }
  },
  event: {
    onPluginEnter<T = any, L = any>(callback: (action: MainEvent<T, L>) => void): void {
      if (getPlatform() === 'uTools') {
        utools.onPluginEnter(callback);
      }
    },
    onMainPush<T = any>(callback: MainPushCallback<T>, selectCallback: MainPushSelectCallback<T>): void {
      if (getPlatform() === 'uTools') {
        utools.onMainPush(callback, selectCallback);
      }
    }
  },
  browser: {
    openUrl(url: string, width?: number, height?: number) {
      if (getPlatform() === 'uTools') {
        utools.ubrowser
          .goto(url)
          .run({width: width || 1200, height: height || 800})
          .then(console.log);
      } else {
        shellOpenExternal(url);
      }
    },
    openMd(text: string) {
      if (getPlatform() === 'uTools') {
        return utools.ubrowser.goto('https://knowledge-base.esion.xyz/md/')
          .wait("#editor")
          .wait(1000)
          .evaluate((text) => {
            // @ts-ignore
            window.setValue(text);
          }, text)
          .run({width: 1200, height: 800})
      }
    },
    async feedback(params?: Record<string, string>) {
      const query = new URLSearchParams();
      query.set("type", "utools");
      query.set("pluginId", "1894929764697055232");
      if (params) Object.entries(params).forEach(([key, value]) => query.set(key, value));
      if (getPlatform() === 'uTools') {
        // utools
        const t = await utools.fetchUserServerTemporaryToken()
        query.set("accessToken", t.token);
        return utools.ubrowser.goto(`https://feedback.esion.xyz/#/auth?${query.toString()}`).run({
          width: 1200,
          height: 800
        })
      } else {
        shellOpenExternal(`https://feedback.esion.xyz/#/auth?${query.toString()}`);
      }
    }
  },
}