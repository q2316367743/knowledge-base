// 窗口相关工具
import {useErrorStore} from "@/store/components/ErrorStore";

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
   * @param callback 打开成功后回调
   */
  open(callback: (windowId: number) => void): void;

  /**
   * 向子窗口发送消息
   * @param channel 子窗口频道
   * @param message 消息
   */
  sendMessage<T = any>(channel: SubWindowChannel, message: IpcEvent<T>): void;
  close(): void;
  hide(): void;
  show(): void;
  setAlwaysOnTop(alwaysOnTop: boolean): void;
  isAlwaysOnTop(): boolean;
  isDestroyed(): boolean;
  getId(): number;
  minimize(): void;

}

export class CustomerWindowForUTools implements CustomerWindow {
  private readonly url: string;
  private readonly props: Partial<CustomerWindowProps>;
  private win: BrowserWindow.WindowInstance | null;

  constructor(url: string, props: Partial<CustomerWindowProps>) {
    this.url = url;
    this.props = props;
    this.win = null;
  }

  open(callback?: (windowId: number) => void): void {
    const dev = utools.isDev();
    this.win = utools.createBrowserWindow(dev ? 'test.html' : `dist/${this.url}`, {
      ...this.props,
      webPreferences: {
        preload: 'sub-window.js',
        zoomFactor: 0,
        devTools: dev
      },
    }, () => {
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
      callback?.(this.win.webContents.id);
    });
  }

  sendMessage<T = any>(channel: SubWindowChannel, message: IpcEvent<T>): void {
    if (!this.win) return;
    window.preload.ipcRenderer.sendMessage<T>(this.win.webContents.id, channel, message);
  }

  close(): void {
    if (!this.win) return;
    this.win.close();
  }

  hide(): void {
    if (!this.win) return;
    this.win.hide();
  }

  show(): void {
    if (!this.win) return;
    this.win.show();
  }

  isAlwaysOnTop(): boolean {
    if (!this.win) return false;
    return this.win.isAlwaysOnTop();
  }

  setAlwaysOnTop(alwaysOnTop: boolean): void {
    if (!this.win) return;
    return this.win.setAlwaysOnTop(alwaysOnTop);
  }


  isDestroyed(): boolean {
    if (!this.win) return true;
    return this.win.isDestroyed();
  }

  minimize(): void {
    if (!this.win) return;
    return this.win.minimize();
  }

  getId(): number {
    if (!this.win) return 0;
    return this.win.webContents.id;
  }
}

export class CustomerWindowForWeb implements CustomerWindow {
  private readonly url: string;
  private readonly props: Partial<CustomerWindowProps>;
  private opener: Window | null;
  private readonly id: number = Date.now();

  constructor(url: string, props: Partial<CustomerWindowProps>) {
    this.url = url;
    this.props = props;
    this.opener = null;
  }

  open(callback?: (windowId: number) => void): void {
    let u = this.url;
    if (this.props.params) {
      const p = new URLSearchParams();
      Object.entries(this.props.params).forEach(([key, value]) => p.append(key, value));
      u += `?${p.toString()}`
    }
    this.opener = window.open(`./${u}`);
    callback?.(0);
  }

  sendMessage<T = any>(channelName: SubWindowChannel, message: IpcEvent<T>): void {
    // 创建频道并发送消息
    const channel = new BroadcastChannel(channelName);
    channel.postMessage(message);
  }

  close(): void {
    if (!this.opener) return;
    this.opener.close();
  }

  hide(): void {
  }

  show(): void {
  }

  isAlwaysOnTop(): boolean {
    return false;
  }

  setAlwaysOnTop(alwaysOnTop: boolean): void {
  }

  getId(): number {
    return this.id;
  }

  isDestroyed(): boolean {
    return false;
  }

  minimize(): void {
  }

}

