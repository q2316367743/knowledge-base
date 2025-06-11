// import {InjectionWebResult, http} from '@/utils/utools/common';

export const NativeUtil = {
  encrypt: {
    encryptPassword: (password: string): string => {
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