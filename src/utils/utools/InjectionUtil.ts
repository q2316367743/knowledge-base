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
  getPlatform(): 'uTools'|'FocusAny'|'unknown' {
    if ('utools' in window) {
      return 'uTools';
    } else if ('focusany' in window) {
      return 'FocusAny';
    } else {
      return 'unknown';
    }
  },
  isDev() {
    if ('utools' in window) {
      return utools.isDev()
    } else if ('focusany' in window) {
      return focusany.getPluginEnv() === 'dev';
    } else {
      return import.meta.env.DEV;
    }
  },
  copyText(text: string) {
    const r = (() => {
      if ('utools' in window) {
        return utools.copyText(text)
      } else if ('focusany' in window) {
        return focusany.copyText(text);
      } else {
        return false
      }
    })();
    if (r) {
      MessageUtil.success("已复制到剪切板");
    } else {
      MessageUtil.error("复制失败");
    }
  },
  shellOpenExternal(url: string): void {
    if ('utools' in window) {
      return utools.shellOpenExternal(url);
    } else if ('focusany' in window) {
      return focusany.shellOpenExternal(url);
    }
  },
  showMainWindow() {
    if ('utools' in window) {
      return utools.showMainWindow();
    } else if ('focusany' in window) {
      return focusany.showMainWindow();
    } else {
      return false;
    }
  },
  hideMainWindow() {
    if ('utools' in window) {
      return utools.hideMainWindow();
    } else if ('focusany' in window) {
      return focusany.hideMainWindow();
    } else {
      return false;
    }
  },
  outPlugin(isKill?: boolean): boolean {
    if ('utools' in window) {
      utools.hideMainWindow();
      return utools.outPlugin(isKill);
    } else if ('focusany' in window) {
      focusany.hideMainWindow();
      return focusany.outPlugin();
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
      } else if ('focusany' in window) {
        return focusany.dbStorage.setItem(key, value);
      }
    },
    /**
     * 获取键名对应的值
     */
    getItem<T = any>(key: string): T {
      if ('utools' in window) {
        return utools.dbStorage.getItem<T>(key);
      } else if ('focusany' in window) {
        return focusany.dbStorage.getItem<T>(key);
      } else {
        return null as T;
      }

    },
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void {
      if ('utools' in window) {
        return utools.dbStorage.removeItem(key);
      } else if ('focusany' in window) {
        return focusany.dbStorage.removeItem(key);
      }
    }
  },
  db: {
    async put(doc: InjectionDbDoc): Promise<InjectionDbReturn> {
      if ('utools' in window) {
        return utools.db.promises.put(doc);
      } else if ('focusany' in window) {
        return Promise.resolve(focusany.db.put(doc));
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async get(id: string): Promise<InjectionDbDoc | null> {
      if ('utools' in window) {
        return utools.db.promises.get(id);
      } else if ('focusany' in window) {
        return Promise.resolve(focusany.db.get(id));
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async remove(doc: string | InjectionDbDoc): Promise<InjectionDbReturn> {
      if ('utools' in window) {
        return utools.db.promises.remove(doc);
      } else if ('focusany' in window) {
        return Promise.resolve(focusany.db.remove(doc));
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async allDocs(key?: string): Promise<InjectionDbDoc[]> {
      if ('utools' in window) {
        return utools.db.promises.allDocs(key);
      } else if ('focusany' in window) {
        return Promise.resolve(focusany.db.allDocs(key));
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }

    },
    async postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<InjectionDbReturn> {
      if ('utools' in window) {
        return utools.db.promises.postAttachment(docId, attachment, type);
      } else if ('focusany' in window) {
        return Promise.resolve(focusany.db.postAttachment(docId, attachment, type));
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    getAttachment(docId: string): Uint8Array | null {
      if ('utools' in window) {
        return utools.db.getAttachment(docId);
      } else if ('focusany' in window) {
        return focusany.db.getAttachment(docId);
      } else {
        throw new Error("系统环境异常");
      }
    },
    async getAttachmentType(docId: string): Promise<string | null> {
      if ('utools' in window) {
        return utools.db.promises.getAttachmentType(docId);
      } else if ('focusany' in window) {
        return Promise.resolve(focusany.db.getAttachmentType(docId));
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    }
  },
  getCursorScreenPoint(): { x: number, y: number } {
    if ('utools' in window) {
      return utools.getCursorScreenPoint();
    } else if ('focusany' in window) {
      return focusany.getCursorScreenPoint();
    } else {
      return {x: 0, y: 0};
    }
  },
  createBrowserWindow(url: string, options: BrowserWindow.InitOptions, callback?: () => void): BrowserWindow.WindowInstance {
    if ('utools' in window) {
      return utools.createBrowserWindow(url, options, callback);
    } else if ('focusany' in window) {
      return focusany.createBrowserWindow(url, options, callback);
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
    } else if ('focusany' in window) {
      let action: any | null = null;
      if (typeof cmd === 'string') {
        action = {
          type: 'key',
          key: cmd
        };
      } else if (cmd.type === 'files') {
        action = {
          type: 'file',
          title: cmd.label,
          minCount: cmd.minLength,
          maxCount: cmd.maxLength,
          fileType: cmd.fileType,
        }
      } else if (cmd.type === 'over') {
        action = {
          type: 'over',
          title: cmd.label,
          minLength: cmd.minLength,
          maxLength: cmd.maxLength
        }
      }
      if (!action) {
        return false;
      }
      return focusany.setAction({
        name: code,
        title: Constant.name,
        icon: "public/logo.png",
        platform: ['osx', 'win', 'linux'],
        type: 'command',
        matches: [action]
      })
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
    } else if ('focusany' in window) {
      const actions = focusany.getActions([code]);
      if (actions.length === 0) {
        return null
      }
      for (let action of actions) {
        if (action.name === code) {
          const cmds = new Array<string | FeatureCmd>();
          if (action.matches.length > 0) {
            for (let match of action.matches) {
              if (match.type === 'key') {
                cmds.push((match as ActionMatchKey).key);
              } else if (match.type === 'file') {
                const m = match as ActionMatchFile;
                cmds.push({
                  type: 'files',
                  label: m.title!,
                  fileType: m.filterFileType,
                  minLength: m.minCount,
                  maxLength: m.maxCount
                })
              } else if (match.type === 'text') {
                const m = match as ActionMatchText;
                cmds.push({
                  type: 'over',
                  label: m.name!,
                  match: m.text,
                  minLength: m.minLength,
                  maxLength: m.maxLength
                })
              }
            }
          }
          return {
            code: action.name,
            explain: action.title,
            platform: ['darwin', 'win32', 'linux'],
            icon: action.icon,
            cmds
          }
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
    } else if ('focusany' in window) {
      return focusany.removeAction(code);
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
    } else if ('focusany' in window) {
      let features: Array<PluginAction>;
      if (typeof prefix === 'string') {
        if (keys) {
          features = focusany.getActions(keys.map(key => prefix + key));
        } else {
          features = focusany.getActions([prefix]);
        }
      } else {
        features = focusany.getActions(prefix);
      }
      return features.map(feature => feature.name);

    } else {
      return [];
    }
  },
  screenCapture(callback: (imgBase64: string) => void): void {
    if ('utools' in window) {
      utools.screenCapture(callback);
    } else if ('focusany' in window) {
      focusany.screenCapture(callback);
    }
  },
  isWindows(): boolean {
    return 'utools' in window ? utools.isWindows() : 'focusany' in window ? focusany.isWindows() : false;
  },
  getWindowType(): 'main' | 'detach' | 'browser' {
    return 'utools' in window ? utools.getWindowType() : 'detach';
  },
  isDarkColors(): boolean {
    return 'utools' in window ? utools.isDarkColors() : 'focusany' in window ? focusany.isDarkColors() : false;
  },
  redirect(label: string | string[], payload: string | { type: 'text' | 'img' | 'files', data: any }): boolean {
    if ('utools' in window) {
      return utools.redirect(label, payload);
    } else if ('focusany' in window) {
      focusany.redirect(label, {
        keywords: typeof payload === 'string' ? payload : payload.data,
        currentText: typeof payload === 'string' ? payload : undefined,
        currentFiles: typeof payload !== 'string' && payload.type === 'files' ? payload.data : undefined,
        currentImage: typeof payload !== 'string' && payload.type === 'img' ? payload.data : undefined,
      });
      return true;
    } else {
      return false;
    }
  },
  getUser(): { avatar: string, nickname: string, type: string } | null {
    if ('utools' in window) {
      return utools.getUser();
    } else if ('focusany' in window) {
      const u = focusany.getUser();
      return {
        avatar: u.avatar,
        nickname: u.nickname,
        type: u.vipFlag
      }
    } else {
      return null;
    }
  },
  getPath(name: PathName): string {
    if ('utools' in window) {
      return utools.getPath(name);
    } else if ('focusany' in window) {
      return focusany.getPath(name);
    } else {
      return '';
    }
  },
  showNotification(body: string, featureName?: string): void {
    if ('utools' in window) {
      utools.showNotification(body, featureName);
    } else if ('focusany' in window) {
      focusany.showNotification(body, featureName);
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
    } else if ('focusany' in window) {
      const result = await focusany.getUserAccessToken();
      return {
        token: result.token,
        expiredAt: result.expireAt
      }
    } else {
      return Promise.reject(new Error('不支持的平台'));
    }
  },
  payment: {
    open(options: OpenPaymentOptions, callback?: () => void): void {
      if ('utools' in window) {
        utools.openPayment(options, callback);
      } else if ('focusany' in window) {
        focusany.openGoodsPayment(options).then((e) => {
          if (e.paySuccess) callback && callback();
        });
      } else {
        throw new Error('不支持的平台');
      }
    },
    async fetch(): Promise<Array<PaymentOrder>> {
      if ('utools' in window) {
        return utools.fetchUserPayments();
      } else if ('focusany' in window) {
        const results = new Array<PaymentOrder>();
        const rsp = await focusany.queryGoodsOrders({});
        for (const record of rsp.records) {
          if (record.status !== 'Paid') continue;
          results.push({
            order_id: record.id,
            total_fee: 0,
            body: '',
            attach: '',
            goods_id: record.goodsId,
            out_order_id: '',
            paid_at: ''
          })
        }
        return results;
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
      } else if ('focusany' in window) {
        focusany.onPluginReady(e => {
          callback({
            code: e.actionName,
            type: e.actionMatch?.type || 'text',
            payload: (e.actionMatch?.type === 'text' ? `${(e.actionMatch as ActionMatchText).text}` : '') as T,
            option: {} as any
          })
        });
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
      } else if ('focusany' in window) {
        focusany.shellOpenExternal(url);
      } else {
        throw new Error("未知平台，无法打开链接");
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
  }
}