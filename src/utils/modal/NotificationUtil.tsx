import {Button, NotifyPlugin} from "tdesign-vue-next";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getItem, setItem} from "@/utils/utools/DbStorageUtil";

export default {
  success(content: string, title?: string): void {
    NotifyPlugin.success({
      default: content,
      title,
      closeBtn: true,
      duration: 1000
    })
  },
  info(content: string, title?: string): void {
    NotifyPlugin.info({
      default: content,
      title,
      closeBtn: true,
    })
  },
  warning(content: string, title?: string): void {
    NotifyPlugin.warning({
      default: content,
      title,
      closeBtn: true
    })
  },
  error(content: string, title?: string): void {
    NotifyPlugin.error({
      default: content,
      title,
      closeBtn: true
    })
  },

  confirm(content: string, title: string, config: {
    confirmButtonText: string,
    cancelButtonText: string,
    duration?: number
  }): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let flag = true;
      let notificationReturn = await NotifyPlugin.info({
        default: content,
        title,
        closeBtn: true,
        duration: config.duration,
        footer: () => <div>
          <Button theme={'primary'} variant={'text'} onClick={() => {
            reject();
            flag = false;
            notificationReturn.close();
          }}>{config.cancelButtonText}</Button>
          <Button theme={'primary'} onClick={() => {
            resolve();
            flag = false;
            notificationReturn.close();
          }}>{config.confirmButtonText}</Button>
        </div>,
        onCloseBtnClick() {
          if (flag) {
            reject();
          }
        }
      });
    })
  },

  alert(content: string, title: string, config: {
    confirmButtonText: string,
    duration?: number
  }): Promise<void> {
    const {confirmButtonText, duration} = config;
    return new Promise<void>(async resolve => {
      function onConfirm() {
        resolve();
        notificationReturn.close();
      }

      const notificationReturn = await NotifyPlugin.info({
        default: content,
        title,
        closeBtn: true,
        duration: duration,
        footer: () => <div style={{textAlign: 'right'}}>
          <Button theme={'primary'} onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </div>,
      });
    })
  },

  warningClose(content: string, title: string, key: LocalNameEnum, condition?: () => boolean): void {
    if (condition) {
      if (!condition()) {
        return;
      }
    }
    if (getItem(key)) {
      return;
    }

    function onRemove() {
      promise.then(s => s.close());
      setItem(key, true);
    }

    const promise = NotifyPlugin.warning({
      default: content,
      title,
      closeBtn: () => <Button theme={'primary'} variant={'text'} onClick={onRemove}>不再提示</Button>
    });
  },
}
