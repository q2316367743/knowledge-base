// 窗口相关工具
import {useErrorStore} from "@/store/components/ErrorStore";
import {getPlatform} from "@/utils/utools/common";
import {getCurrentWebviewWindow, WebviewWindow} from '@tauri-apps/api/webviewWindow'
import {TauriEvent} from "@tauri-apps/api/event";

export interface CustomerWindowProps extends BrowserWindow.InitOptions {
  useContentSize: boolean;
  width: number
  height: number;
  minWidth: number;
  minHeight: number;
  hasShadow: boolean;
  resizable: boolean
  alwaysOnTop: boolean
  frame: boolean
  transparent: boolean
  backgroundColor: string
  icon: string
  show: boolean
  x: number
  y: number;
  params: Record<string, string>
}

/**
 * 自定义窗口
 */
export interface CustomerWindow {

  /**
   * 打开自定义窗口
   */
  open(): Promise<void>;

  /**
   * 向子窗口发送消息
   * @param channel 子窗口频道
   * @param message 消息
   */
  sendMessage<T = any>(channel: SubWindowChannel, message: IpcEvent<T>): Promise<void>;

  close(): Promise<void>;

  hide(): Promise<void>;

  show(): Promise<void>;

  setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;

  isAlwaysOnTop(): Promise<boolean>;

  isDestroyed(): Promise<boolean>;

  minimize(): Promise<void>;

}

class CustomerWindowForUTools implements CustomerWindow {
  private readonly url: string;
  private readonly props: Partial<CustomerWindowProps>;
  private win: BrowserWindow.WindowInstance | null;

  constructor(url: string, props: Partial<CustomerWindowProps>) {
    this.url = url;
    this.props = props;
    this.win = null;
  }

  open(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dev = utools.isDev();
      this.win = utools.createBrowserWindow(dev ? 'test.html' : `dist/${this.url}`, {
        ...this.props,
        webPreferences: {
          preload: 'sub-window.js',
          zoomFactor: 0,
          devTools: dev
        },
      }, () => {
        try {
          if (!this.win) return;
          // 显示窗口
          this.win.show();
          if (dev) {
            let u = this.url;
            if (this.props.params) {
              const p = new URLSearchParams();
              Object.entries(this.props.params).forEach(([key, value]) => p.append(key, value));
              u += `?${p.toString()}`
            }
            this.win.webContents.executeJavaScript(`location.href = 'http://localhost:5173/${u}'`)
              .then(() => console.debug("代码执行成功"))
              .catch((e: any) => console.error("代码执行失败", e));
            this.win.webContents.openDevTools();
          } else if (useErrorStore().consoleShow) {
            this.win.webContents.openDevTools();
          }
          resolve()
        } catch (e) {
          reject(e);
        }
      });
    })
  }

  async sendMessage<T = any>(channel: SubWindowChannel, message: IpcEvent<T>): Promise<void> {
    if (!this.win) return;
    window.preload.ipcRenderer.sendMessage<T>(this.win.webContents.id, channel, message);
  }

  async close() {
    if (!this.win) return Promise.reject(new Error("窗口未打开"));
    this.win.close();
  }

  async hide() {
    if (!this.win) return Promise.reject(new Error("窗口未打开"));
    this.win.hide();
  }

  async show() {
    if (!this.win) return Promise.reject(new Error("窗口未打开"));
    this.win.show();
  }

  async isAlwaysOnTop() {
    if (!this.win) return false;
    return this.win.isAlwaysOnTop();
  }

  async setAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
    if (!this.win) return Promise.reject(new Error("窗口未打开"));
    this.win.setAlwaysOnTop(alwaysOnTop);
  }


  async isDestroyed() {
    if (!this.win) return true;
    return this.win.isDestroyed();
  }

  async minimize(): Promise<void> {
    if (!this.win) return Promise.reject(new Error("窗口未打开"));
    this.win.minimize();
  }
}

class CustomerWindowForWeb implements CustomerWindow {
  private readonly url: string;
  private readonly props: Partial<CustomerWindowProps>;
  private opener: Window | null;

  constructor(url: string, props: Partial<CustomerWindowProps>) {
    this.url = url;
    this.props = props;
    this.opener = null;
  }

  open(): Promise<void> {
    return new Promise<void>((resolve) => {
      let u = this.url;
      if (this.props.params) {
        const p = new URLSearchParams();
        Object.entries(this.props.params).forEach(([key, value]) => p.append(key, value));
        u += `?${p.toString()}`
      }
      this.opener = window.open(`./${u}`);
      resolve();
    })
  }

  async sendMessage<T = any>(channelName: SubWindowChannel, message: IpcEvent<T>) {
    // 创建频道并发送消息
    const channel = new BroadcastChannel(channelName);
    channel.postMessage(message);
  }

  async close() {
    if (!this.opener) return;
    this.opener.close();
  }

  async hide() {
  }

  async show() {
  }

  async isAlwaysOnTop() {
    return false;
  }

  async setAlwaysOnTop(alwaysOnTop: boolean) {
  }

  async isDestroyed() {
    return false;
  }

  async minimize() {
  }

}

class CustomerWindowForTauri implements CustomerWindow {
  private readonly label: string;
  private readonly url: string;
  private readonly props: Partial<CustomerWindowProps>;
  private ww: WebviewWindow | null = null;
  private destroyed: boolean = false;

  constructor(label: string, url: string, props: Partial<CustomerWindowProps>) {
    this.label = label;
    this.url = url;
    this.props = props;
  }

  open(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ww = new WebviewWindow(this.label, {
        x: this.props.x,
        y: this.props.y,
        width: this.props.width,
        height: this.props.height,
        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight,
        alwaysOnTop: this.props.alwaysOnTop,
        backgroundColor: this.props.backgroundColor,
        transparent: this.props.transparent,
        resizable: this.props.resizable,
        shadow: this.props.hasShadow,
        url: this.url
      });
      (async () => {
        await this.ww?.once(TauriEvent.WINDOW_DESTROYED, () => this.destroyed = true);
        // 真正的窗口是否创建成功
        await this.ww?.once('window-initialized', () => resolve());
        await this.ww?.once('tauri://error', reject);
      })().catch(reject);
    })
  }

  async sendMessage<T = any>(channel: SubWindowChannel, message: IpcEvent<T>): Promise<void> {
    if (!this.ww) return;
    await this.ww.emit(channel, message);
  }

  async close() {
    if (!this.ww) return;
    await this.ww.close();
  }

  async hide() {
    if (!this.ww) return;
    await this.ww.hide();
  }

  async isAlwaysOnTop() {
    if (!this.ww) return false;
    return this.ww.isAlwaysOnTop();
  }

  async isDestroyed() {
    return this.destroyed;
  }

  async minimize() {
    if (!this.ww) return Promise.reject(new Error("窗口未打开"));
    await this.ww.minimize();
  }

  async setAlwaysOnTop(alwaysOnTop: boolean) {
    if (!this.ww) return Promise.reject(new Error("窗口未打开"));
    await this.ww.setAlwaysOnTop(alwaysOnTop);
  }

  async show() {
    if (!this.ww) return Promise.reject(new Error("窗口未打开"));
    await this.ww.show();
  }
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

class TauriSubWindow implements SubWindow {
  private readonly ww: WebviewWindow;
  private readonly channel: SubWindowChannel;

  constructor(channel: SubWindowChannel) {
    this.ww = getCurrentWebviewWindow()
    this.channel = channel;
    // 推送创建完成事件
    this.ww.emit('window-initialized');
  }

  receiveMsg<T = any>(callback: (msg: IpcEvent<T>) => void): void {
    this.ww.listen<IpcEvent<T>>(this.channel, ({payload}) => {
      callback(payload);
    });
  }

  sendMsg<T = any>(msg: IpcEvent<T>): void {
    this.ww.emit(this.channel, msg);
  }

}

export const WindowUtil = {
  createBrowserWindow(label: string, url: string, options: Partial<CustomerWindowProps>): CustomerWindow {
    switch (getPlatform()) {
      case 'uTools':
        return new CustomerWindowForUTools(url, options);
      case 'web':
        return new CustomerWindowForWeb(url, options);
      case 'tauri':
        return new CustomerWindowForTauri(label, url, options);
      default:
        throw new Error('Unknown platform');
    }
  },
  buildSubWindow(channel: SubWindowChannel): SubWindow {
    switch (getPlatform()) {
      case 'uTools':
        return window.preload.ipcRenderer.buildSubWindow(channel);
      case "web":
        return new WebSubWindow(channel);
      case "tauri":
        return new TauriSubWindow(channel);
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
  sendToParent(channel: string, ...params: any[]): void {
    if (getPlatform() === 'uTools') {
      utools.sendToParent(channel, ...params);
    } else if (getPlatform() === 'tauri') {
      // 发送到main
    }
  }
}
