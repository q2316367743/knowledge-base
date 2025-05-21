import MessageUtil from "@/utils/modal/MessageUtil";
import Constant from "@/global/Constant";
import {versionGreaterEqual} from "@/utils/lang/FieldUtil";
import {AiService, AiServiceType, InnerAiService} from "@/entity/ai/AiService";

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

interface Feature {
  code: string,
  explain: string,
  platform: FeaturePlatform | Array<FeaturePlatform>,
  icon?: string,
  cmds: Array<string | FeatureCmd>
}

type FeaturePlatform = 'darwin' | 'win32' | 'linux';

interface FeatureCmd {
  type: FeatureCmdType,
  label: string,
  fileType?: FeatureCmdFileType,
  match?: string,
  minLength?: number
  maxLength?: number
}

type FeatureCmdType = 'files' | 'regex' | 'over';

type FeatureCmdFileType = 'file' | 'directory';

type PathName =
  'home'
  | 'appData'
  | 'userData'
  | 'temp'
  | 'exe'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'logs';

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

interface PaymentOrder {
  order_id: string;
  total_fee: number;
  body: string;
  attach: string;
  goods_id: string;
  out_order_id: string;
  paid_at: string;
}

export const InjectionUtil = {
  getPlatform(): 'uTools' | 'FocusAny' | 'web' {
    return 'uTools';
  },
  getUser(): { avatar: string, nickname: string, type: string } | null {
    if ('utools' in window) {
      return utools.getUser();
    } else {
      return null;
    }
  },
  isDev() {
    if ('utools' in window) {
      return utools.isDev()
    } else {
      return import.meta.env.DEV;
    }
  },
  copyText(text: string) {
    (async () => {
      if ('utools' in window) {
        return utools.copyText(text)
      } else {
        await navigator.clipboard.writeText(text);
        return false
      }
    })().then(r => {
      if (r) {
        MessageUtil.success("已复制到剪切板");
      } else {
        MessageUtil.error("复制失败");
      }
    });
  },
  shellOpenExternal(url: string): void {
    if ('utools' in window) {
      return utools.shellOpenExternal(url);
    } else {
      window.open(url);
    }
  },
  showMainWindow() {
    if ('utools' in window) {
      return utools.showMainWindow();
    } else {
      return false;
    }
  },
  hideMainWindow() {
    if ('utools' in window) {
      return utools.hideMainWindow();
    } else {
      return false;
    }
  },
  outPlugin(isKill?: boolean): boolean {
    if ('utools' in window) {
      utools.hideMainWindow();
      return utools.outPlugin(isKill);
    } else {
      return false;
    }
  },
  dbStorage: {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem(key: string, value: any): void {
      if ('utools' in window) {
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
      if ('utools' in window) {
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
      if ('utools' in window) {
        return utools.dbStorage.removeItem(key);
      } else {
        localStorage.removeItem(key);
      }
    }
  },
  db: {
    async put(doc: InjectionDbDoc): Promise<InjectionDbReturn> {
      if ('utools' in window) {
        return utools.db.promises.put(doc);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async get(id: string): Promise<InjectionDbDoc | null> {
      if ('utools' in window) {
        return utools.db.promises.get(id);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async remove(doc: string | InjectionDbDoc): Promise<InjectionDbReturn> {
      if ('utools' in window) {
        return utools.db.promises.remove(doc);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async allDocs(key?: string): Promise<InjectionDbDoc[]> {
      if ('utools' in window) {
        return utools.db.promises.allDocs(key);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }

    },
    async postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<InjectionDbReturn> {
      if ('utools' in window) {
        return utools.db.promises.postAttachment(docId, attachment, type);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    getAttachment(docId: string): Uint8Array | null {
      if ('utools' in window) {
        return utools.db.getAttachment(docId);
      } else {
        throw new Error("系统环境异常");
      }
    },
    async getAttachmentType(docId: string): Promise<string | null> {
      if ('utools' in window) {
        return utools.db.promises.getAttachmentType(docId);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    }
  },
  getCursorScreenPoint(): { x: number, y: number } {
    if ('utools' in window) {
      return utools.getCursorScreenPoint();
    } else {
      return {x: 0, y: 0};
    }
  },
  createBrowserWindow(url: string, options: BrowserWindow.InitOptions, callback?: () => void): BrowserWindow.WindowInstance {
    if ('utools' in window) {
      return utools.createBrowserWindow(url, options, callback);
    } else {
      throw new Error("环境异常");
    }
  },
  setFeatureOneSimple(code: string, cmd: FeatureCmd | string): boolean {
    if ('utools' in window) {
      return utools.setFeature({
        code: code,
        explain: Constant.name,
        icon: "public/logo.png",
        platform: [
          "win32",
          "darwin",
          "linux"
        ],
        cmds: [cmd]
      });
    } else {
      return false
    }
  },
  getFeatureOne(code: string): Feature | null {
    if ('utools' in window) {
      const features = utools.getFeatures([code]);
      if (features.length === 0) {
        return null;
      }
      for (let feature of features) {
        if (feature.code === code) {
          // @ts-ignore
          return feature;
        }
      }
      return null;
    } else {
      return null
    }
  },
  removeFeatureOne(code: string): boolean {
    if ('utools' in window) {
      return utools.removeFeature(code)
    } else {
      return false;
    }
  },
  listFeature(prefix: string | string[], keys?: Array<any>): Array<string> {
    if ('utools' in window) {
      let features;
      if (typeof prefix === 'string') {
        if (keys) {
          features = utools.getFeatures(keys.map(key => prefix + key));
        } else {
          features = utools.getFeatures([prefix]);
        }
      } else {
        features = utools.getFeatures(prefix);
      }
      return features.map(feature => feature.code);
    } else {
      return [];
    }
  },
  screenCapture(callback: (imgBase64: string) => void): void {
    if ('utools' in window) {
      utools.screenCapture(callback);
    } else {
      throw new Error("环境异常");
    }
  },
  isWindows(): boolean {
    // 判断当前操作系统是不是Windows
    return 'utools' in window ? utools.isWindows() : (navigator.userAgent.indexOf('Windows') !== -1);
  },
  getWindowType(): 'main' | 'detach' | 'browser' {
    return 'utools' in window ? utools.getWindowType() : 'detach';
  },
  isDarkColors(): boolean {
    return 'utools' in window ? utools.isDarkColors() : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  redirect(label: string | string[], payload: string | { type: 'text' | 'img' | 'files', data: any }): boolean {
    if ('utools' in window) {
      return utools.redirect(label, payload);
    } else {
      window.open(`utools://${label[0]}/${label[1]}?${payload}`);
      return true;
    }
  },
  getPath(name: PathName): string {
    if ('utools' in window) {
      return utools.getPath(name);
    } else {
      return '';
    }
  },
  showNotification(body: string, featureName?: string): void {
    if ('utools' in window) {
      utools.showNotification(body, featureName);
    } else {
      // 检查浏览器是否支持通知
      if ("Notification" in window) {
        // 请求通知权限
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            // 创建并发送通知
            const notification = new Notification("通知标题", {
              body: body,
            });

            // 可选：处理通知点击事件
            notification.onclick = function () {
              window.focus();
            };
          } else {
            console.error("通知权限被拒绝");
          }
        });
      } else {
        console.error("浏览器不支持通知");
      }
    }
  },
  version: {
    isSupportAi(): boolean {
      if ('utools' in window) {
        return versionGreaterEqual(utools.getAppVersion(), 7)
      } else {
        return false
      }
    },
    isSupportMarkdown(): boolean {
      if ('utools' in window) {
        return versionGreaterEqual(utools.getAppVersion(), 7)
      } else {
        return false
      }
    }
  },
  ai: {
    async service(): Promise<InnerAiService | null> {
      if ('utools' in window) {
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
      if ('utools' in window) {
        return utools.ai(option, streamCallback);
      } else {
        throw new Error("不支持内置AI服务");
      }
    }
  },
  async fetchUserServerTemporaryToken(): Promise<{ token: string, expiredAt: number }> {
    if ('utools' in window) {
      return utools.fetchUserServerTemporaryToken();
    } else {
      return Promise.reject(new Error('不支持的平台'));
    }
  },
  payment: {
    open(options: OpenPaymentOptions, callback?: () => void): void {
      if ('utools' in window) {
        utools.openPayment(options, callback);
      } else {
        throw new Error('不支持的平台');
      }
    },
    async fetch(): Promise<Array<PaymentOrder>> {
      if ('utools' in window) {
        return utools.fetchUserPayments();
      } else {
        return Promise.reject(new Error('不支持的平台'));
      }
    }
  },
  event: {
    onPluginEnter<T = any, L = any>(callback: (action: {
      code: string,
      type: string,
      payload: T,
      option: L,
      from?: PluginEnterFrom
    }) => void): void {
      if ('utools' in window) {
        utools.onPluginEnter(callback);
      }
    },
    onMainPush<T = any>(callback: (action: {
      code: string,
      type: string,
      payload: T
    }) => MainPushResultList, selectCallback: (action: {
      code: string,
      type: string,
      payload: any,
      option: MainPushResult
    }) => void): void {
      if ('utools' in window) {
        utools.onMainPush(callback, selectCallback);
      }
    }
  },
  browser: {
    openUrl(url: string, width?: number, height?: number) {
      if ('utools' in window) {
        utools.ubrowser
          .goto(url)
          .run({width: width || 1200, height: height || 800})
      } else {
        window.open(url);
      }
    },
    openMd(text: string) {
      return utools.ubrowser.goto('https://knowledge-base.esion.xyz/md/')
        .wait("#editor")
        .wait(1000)
        .evaluate((text) => {
          // @ts-ignore
          window.setValue(text);
        }, text)
        .run({width: 1200, height: 800})
    },
  },
  sendToParent(channel: string, ...params: any[]): void {
    utools.sendToParent(channel, ...params);
  }
}