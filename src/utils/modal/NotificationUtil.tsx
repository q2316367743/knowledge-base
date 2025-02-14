import {Button, Notification} from "@arco-design/web-vue";
import {h} from "vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getItem, setItem} from "@/utils/utools/DbStorageUtil";

export default {
  success(content: string, title?: string): void {
    Notification.success({
      content,
      title,
      closable: true,
      duration: 1000
    })
  },
  info(content: string, title?: string): void {
    Notification.info({
      content,
      title,
      closable: true,
    })
  },
  warning(content: string, title?: string): void {
    Notification.warning({
      content,
      title,
      closable: true
    })
  },
  error(content: string, title?: string): void {
    Notification.error({
      content,
      title,
      closable: true
    })
  },

  confirm(content: string, title: string, config: {
    confirmButtonText: string,
    cancelButtonText: string,
    duration?: number
  }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let flag = true;
      let notificationReturn = Notification.info({
        content,
        title,
        closable: true,
        duration: config.duration,
        footer: () => h('div', [
          h(Button, {
            type: 'text',
            onClick: () => {
              reject();
              flag = false;
              notificationReturn.close();
            }
          }, () => (config.cancelButtonText)),
          h(Button, {
            type: 'primary',
            onClick: () => {
              resolve();
              flag = false;
              notificationReturn.close();
            }
          }, () => (config.confirmButtonText))
        ]),
        onClose() {
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
    return new Promise<void>(resolve => {
      function onConfirm() {
        resolve();
        notificationReturn.close();
      }
      const notificationReturn = Notification.info({
        content,
        title,
        closable: true,
        duration: duration,
        footer: () => <div style={{textAlign: 'right'}}>
          <Button type={'primary'} onClick={onConfirm}>
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
      Notification.remove(key);
      setItem(key, true);
    }
    Notification.warning({
      content,
      title,
      closable: true,
      closeIconElement: () => <Button type={'text'} onClick={onRemove}>不再提示</Button>
    })
  },
}
