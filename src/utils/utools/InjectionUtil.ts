import MessageUtil from "@/utils/modal/MessageUtil";
import Constant from "@/global/Constant";
import {versionGreaterEqual} from "@/utils/lang/FieldUtil";
import {AiService, AiServiceType, InnerAiService} from "@/entity/ai/AiService";
import axios from 'axios';
import {
  CustomerWindow,
  CustomerWindowForUTools,
  CustomerWindowForWeb,
  CustomerWindowProps
} from "@/utils/utools/WindowUtil";
import {useSnowflake} from "@/hooks/Snowflake";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {renderAttachmentUrl} from "@/plugin/server";
import {openPayInGoodFaith} from "@/utils/utools/UtoolsModel";

type InjectionDbDoc<T extends {} = Record<string, any>> = {
  _id: string,
  _rev?: string,
} & T

interface InjectionDbResult<T> {
  code: number;
  msg: string;
  data: T;
}

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

class WebSubWindow implements SubWindow {
  private readonly channel: BroadcastChannel;

  constructor(channelName: SubWindowChannel) {
    this.channel = new BroadcastChannel(channelName);
  }

  receiveMsg<T = any>(callback: (msg: IpcEvent<T>) => void): void {
    this.channel.addEventListener('message', (e) => {
      const {data} = e;
      callback(data);
    })
  }

  sendMsg<T = any>(msg: IpcEvent<T>): void {
    this.channel.postMessage(msg);
  }
}

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export interface FileUploadResult {
  // 文件名
  name: string;
  // 文件key，在markdown文档中有效
  key: string;
  // 真正的url，全路径
  url: string;
}

export interface UserProfile {
  avatar: string;
  nickname: string;
  type: 'member' | 'user';
}

export const InjectionUtil = {
  getPlatform(): 'uTools' | 'web' {
    return !!window['utools'] ? 'uTools' : 'web';
  },
  getUser(): UserProfile | null {
    if (window['utools']) {
      return utools.getUser() as UserProfile;
    } else {
      return null;
    }
  },
  isDev() {
    if (window['utools']) {
      return utools.isDev()
    } else {
      return import.meta.env.DEV;
    }
  },
  copyText(text: string) {
    (async () => {
      if (window['utools']) {
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
    if (window['utools']) {
      return utools.shellOpenExternal(url);
    } else {
      window.open(url, '_blank');
    }
  },
  getCursorScreenPoint(): { x: number, y: number } {
    if (window['utools']) {
      return utools.getCursorScreenPoint();
    } else {
      return {x: 0, y: 0};
    }
  },
  createBrowserWindow(url: string, options: Partial<CustomerWindowProps>): CustomerWindow {
    if (window['utools']) {
      return new CustomerWindowForUTools(url, options);
    } else {
      return new CustomerWindowForWeb(url, options);
    }
  },
  screenCapture(callback: (imgBase64: string) => void): void {
    if (window['utools']) {
      utools.screenCapture(callback);
    } else {
      throw new Error("环境异常");
    }
  },
  isDarkColors(): boolean {
    return window['utools'] ? utools.isDarkColors() : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  redirect(label: string | string[], payload: string | { type: 'text' | 'img' | 'files', data: any }): boolean {
    if (window['utools']) {
      return utools.redirect(label, payload);
    } else {
      window.open(`utools://${label[0]}/${label[1]}?${payload}`);
      return true;
    }
  },
  getPath(name: PathName): string {
    if (window['utools']) {
      return utools.getPath(name);
    } else {
      return '';
    }
  },
  showNotification(body: string, featureName?: string): void {
    if (window['utools']) {
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
  sendToParent(channel: string, ...params: any[]): void {
    utools.sendToParent(channel, ...params);
  },
  window: {
    showMainWindow() {
      if (window['utools']) {
        return utools.showMainWindow();
      } else {
        return false;
      }
    },
    hideMainWindow() {
      if (window['utools']) {
        return utools.hideMainWindow();
      } else {
        return false;
      }
    },
    getWindowType(): 'main' | 'detach' | 'browser' {
      return window['utools'] ? utools.getWindowType() : 'detach';
    },
    isWindows(): boolean {
      // 判断当前操作系统是不是Windows
      return window['utools'] ? utools.isWindows() : (navigator.userAgent.indexOf('Windows') !== -1);
    },
    outPlugin(isKill?: boolean): boolean {
      if (window['utools']) {
        utools.hideMainWindow();
        return utools.outPlugin(isKill);
      } else {
        return false;
      }
    },
  },
  feature: {
    listFeature(prefix: string | string[], keys?: Array<any>): Array<string> {
      if (window['utools']) {
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
    setFeatureOneSimple(code: string, cmd: FeatureCmd | string): boolean {
      if (window['utools']) {
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
      if (window['utools']) {
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
      if (window['utools']) {
        return utools.removeFeature(code)
      } else {
        return false;
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
      if (window['utools']) {
        return utools.db.promises.put(doc);
      } else {
        return http.post<InjectionDbResult<InjectionDbReturn>>('/db/put', {
          key: doc._id,
          value: doc
        }).then(res => {
          const {data} = res;
          if (data.code === 200) {
            return data.data;
          } else {
            throw new Error(data.msg);
          }
        });
      }
    },
    async get(id: string): Promise<InjectionDbDoc | null> {
      if (window['utools']) {
        return utools.db.promises.get(id);
      } else {
        return http.get<InjectionDbResult<InjectionDbDoc>>('/db/get', {
          params: {
            key: id
          }
        }).then(res => {
          const {data} = res;
          if (data.code === 200) {
            return data.data;
          } else {
            throw new Error(data.msg);
          }
        });
      }
    },
    async remove(doc: string | InjectionDbDoc): Promise<InjectionDbReturn> {
      if (window['utools']) {
        return utools.db.promises.remove(doc);
      } else {
        return http.get<InjectionDbResult<InjectionDbReturn>>('/db/delete', {
          params: {
            key: typeof doc === 'string' ? doc : doc._id
          }
        }).then(res => {
          const {data} = res;
          if (data.code === 200) {
            return data.data;
          } else {
            throw new Error(data.msg);
          }
        });
      }
    },
    async allDocs(key?: string): Promise<InjectionDbDoc[]> {
      if (window['utools']) {
        return utools.db.promises.allDocs(key);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }

    },
    async postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<InjectionDbReturn> {
      if (window['utools']) {
        return utools.db.promises.postAttachment(docId, attachment, type);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    getAttachment(docId: string): Uint8Array | null {
      if (window['utools']) {
        return utools.db.getAttachment(docId);
      } else {
        throw new Error("系统环境异常");
      }
    },
    async getAttachmentType(docId: string): Promise<string | null> {
      if (window['utools']) {
        return utools.db.promises.getAttachmentType(docId);
      } else {
        return Promise.reject(new Error("系统环境异常"))
      }
    },
    async upload(file: Blob, fileName: string, mineType = "application/octet-stream"): Promise<FileUploadResult> {
      const id = useSnowflake().nextId();
      const docId = LocalNameEnum.ARTICLE_ATTACHMENT + id;
      if (window['utools']) {
        const buffer = await file.arrayBuffer();
        const res = await InjectionUtil.db.postAttachment(docId, new Uint8Array(buffer), mineType);
        if (res.error) {
          return Promise.reject(res.message);
        }
        return {
          name: fileName,
          key: docId,
          url: renderAttachmentUrl(docId)
        }
      } else {
        // 文件上传
        const formData = new FormData();
        formData.append('file', file);
        const rsp = await http.post('/file/upload', formData);
        const {data} = rsp;
        return data
      }
    }
  },
  version: {
    isSupportAi(): boolean {
      if (window['utools']) {
        return versionGreaterEqual(utools.getAppVersion(), 7)
      } else {
        return false
      }
    },
    isSupportMarkdown(): boolean {
      if (window['utools']) {
        return versionGreaterEqual(utools.getAppVersion(), 7)
      } else {
        return false
      }
    }
  },
  ai: {
    async service(): Promise<InnerAiService | null> {
      if (window['utools']) {
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
      if (window['utools']) {
        return utools.ai(option, streamCallback);
      } else {
        throw new Error("不支持内置AI服务");
      }
    }
  },
  payment: {
    open(options: OpenPaymentOptions, callback?: () => void): void {
      if (window['utools']) {
        utools.openPayment(options, callback);
      } else {
        openPayInGoodFaith().then(() => {
          http.post('/payment/save', {
            goodId: options.goodsId
          }).then(res => {
            const {data} = res;
            if (data.code === 200) {
              callback?.()
            }
          })
        }).catch(() => MessageUtil.warning("取消支付"))
      }
    },
    // 获取全部的订单ID
    async fetch(): Promise<Array<string>> {
      if (window['utools']) {
        return utools.fetchUserPayments().then(res => res.map(e => e.goods_id));
      } else {
        const rsp = await http.get<InjectionDbResult<Array<string>>>('/payment/list');
        return rsp.data.data;
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
      if (window['utools']) {
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
      if (window['utools']) {
        utools.onMainPush(callback, selectCallback);
      }
    }
  },
  browser: {
    openUrl(url: string, width?: number, height?: number) {
      if (window['utools']) {
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
    async feedback(params?: Record<string, string>) {
      const query = new URLSearchParams();
      query.set("type", "utools");
      query.set("pluginId", "1894929764697055232");
      if (params) Object.entries(params).forEach(([key, value]) => query.set(key, value));
      if (window['utools']) {
        // utools
        const t = await utools.fetchUserServerTemporaryToken()
        query.set("accessToken", t.token);
        return utools.ubrowser.goto(`https://feedback.esion.xyz/#/auth?${query.toString()}`).run({
          width: 1200,
          height: 800
        })
      } else {
        window.open(`https://feedback.esion.xyz/#/auth?${query.toString()}`);
      }
    }
  },
  native: {
    encrypt: {
      encryptPassword: (password: string) => {
        if (window.preload) {
          return window.preload.encrypt.encryptPassword(password);
        } else {
          throw new Error("系统环境异常")
        }
      },
      verifyPassword: (password: string, key: string): EncryptKeyIv | boolean => {
        if (window.preload) {
          return window.preload.encrypt.verifyPassword(password, key);
        } else {
          throw new Error("系统环境异常")
        }
      },
      encryptValue: (keyIv: EncryptKeyIv, data: string): string => {
        if (window.preload) {
          return window.preload.encrypt.encryptValue(keyIv, data);
        } else {
          throw new Error("系统环境异常")
        }
      },
      decryptValue: (keyIv: EncryptKeyIv, data: string): string => {
        if (window.preload) {
          return window.preload.encrypt.decryptValue(keyIv, data);
        } else {
          throw new Error("系统环境异常")
        }
      },
    },
    util: {
      uploadToImagePlus(filePath: string, pluginName: string): Promise<string> {
        if (window.preload) {
          return window.preload.util.uploadToImagePlus(filePath, pluginName);
        } else
          throw new Error("系统环境异常")
      },
      /**
       * 运行命令
       * @param command 命令
       * @param options 参数
       */
      runCommand(command: string, options: {
        onProgress: (e: string) => void,
        onSuccess: () => void,
        onError: (e: string) => void
      }): { abort: () => void } {
        if (window.preload) {
          return window.preload.util.runCommand(command, options);
        } else {
          throw new Error("系统环境异常")
        }
      },
      axios: {},
    },
    ipcRenderer: {
      buildSubWindow(channel: SubWindowChannel): SubWindow {
        if (window.preload) {
          return window.preload.ipcRenderer.buildSubWindow(channel);
        } else {
          return new WebSubWindow(channel);
        }
      },
      receiveMessage<T = any>(channelName: SubWindowChannel, callback: (msg: IpcEvent<T>) => void): void {
        if (window.preload)
          window.preload.ipcRenderer.receiveMessage(channelName, callback);
        else {
          const channel = new BroadcastChannel(channelName);
          channel.addEventListener('message', e => {
            const {data} = e;
            if (data) {
              callback(data);
            }
          });
        }
      },
      sendMessage<T = any>(id: number, channelName: SubWindowChannel, message: IpcEvent<T>): void {
        if (window.preload)
          window.preload.ipcRenderer.sendMessage(id, channelName, message);
        else {
          const channel = new BroadcastChannel(channelName);
          channel.postMessage(message);
          channel.close();
        }
      },
    },
    customer: {
      writeToFile: (dir: string, name: string, content: Blob, root?: string): Promise<string> => {
        if (window.preload) {
          return window.preload.customer.writeToFile(dir, name, content, root);
        } else {
          throw new Error("系统环境异常")
        }
      },
      writeStrToFile: (dir: string, name: string, content: string, root?: string): Promise<{
        folder: string,
        filePath: string
      }> => {
        if (window.preload) {
          return window.preload.customer.writeStrToFile(dir, name, content, root);
        } else {
          throw new Error("系统环境异常")
        }
      },
      writeBlobToFile: (content: Blob, title: string): Promise<string> => {
        if (window.preload) {
          return window.preload.customer.writeBlobToFile(content, title);
        } else {
          throw new Error("系统环境异常")
        }
      },
      checkFileExist(root: string, dir: string, file: string): boolean {
        if (window.preload) {
          return window.preload.customer.checkFileExist(root, dir, file);
        } else {
          throw new Error("系统环境异常")
        }
      },
      downloadFile(root: string, dir: string, fileName: string, url: string): Promise<void> {
        if (window.preload) {
          return window.preload.customer.downloadFile(root, dir, fileName, url);
        } else {
          throw new Error("系统环境异常")
        }
      },
      createServer(port: number, success: () => void, error: (error: Error) => void): void {
        if (window.preload) {
          window.preload.customer.createServer(port, success, error);
        } else {
          success();
        }
      },
      openFile(options: OpenFileOption): Promise<Array<File>> {
        if (window.preload) {
          return window.preload.customer.openFile(options);
        } else {
          throw new Error("系统环境异常")
        }
      },
    }
  }
}