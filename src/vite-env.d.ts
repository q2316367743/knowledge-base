/// <reference types="vite/client" />
declare module 'simple-mind-map/src/plugins/MiniMap.js';
declare module 'simple-mind-map/src/plugins/Export.js';
declare module 'simple-mind-map/src/plugins/ExportPDF.js';
declare module 'simple-mind-map/src/plugins/ExportXMind.js';
declare module 'simple-mind-map/src/parse/xmind.js';
declare module 'simple-mind-map/src/parse/markdown.js';
declare module 'simple-mind-map/src/plugins/AssociativeLine.js';
declare module 'simple-mind-map/src/plugins/Select.js';
declare module 'simple-mind-map/src/plugins/Drag.js';

// editor.js

declare interface OpenFileOption {
  title?: string,
  defaultPath?: string,
  buttonLabel?: string,
  filters?: { name: string, extensions: string[] }[],
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>,
  message?: string,
  securityScopedBookmarks?: boolean
}

class SubWindow {
  constructor(channel: string);
  receiveMsg<T = any>(callback: (msg: T) => void): void;
  sendMsg<T = any>(msg: T): void
}

declare interface Window {
  /**
   * 打开图片预览
   * @param src 图片链接
   */
  onImagePreview: (src: string) => void;
  /**
   * 跳转到文章
   * @param title 文章标题
   */
  jumpToArticle: (title: string) => void;

  preload: {

    customer: {
      // 写入文件
      writeToFile: (dir: string, name: string, content: Blob, root?: string) => Promise<string>;
      writeStrToFile: (dir: string, name: string, content: string, root?: string) => Promise<{
        folder: string,
        filePath: string
      }>;
      checkFileExist(root: string, dir: string, file: string): boolean;
      downloadFile(root: string, dir: string, fileName: string, url: string): Promise<void>;
      /**
       * 创建本地服务器
       * @param port 端口号
       * @param success 成功回调
       * @param error 失败回调
       */
      createServer(port: number, success: () => void, error: (error: Error) => void): void;
      /**
       * 打开一个文件，并返回blob对象
       * @param options 参数
       * @return 返回blob对象
       */
      openFile(options: OpenFileOption): Promise<Array<File>>
    },

    path: {
      join(...paths: string[]): string;
    },
    ipcRenderer: {
      buildSubWindow(channel): SubWindow;
      receiveMessage(event: string, callback: (msg: string) => void): void;
      sendMessage<T = any>(id: number, channel: 'chat', message: T): void;
    },
    util: {
      uploadToImagePlus(filePath: string, pluginName: string): Promise<string>;
      /**
       * 运行命令
       * @param command 命令
       * @param options 参数
       */
      runCommand(command: string, options: {
        onProgress: (e: string) => void,
        onSuccess: () => void,
        onError: (e: string) => void
      }): { abort: () => void }
    }
  }
}
