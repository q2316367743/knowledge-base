import {
  Modal,
  ModalReturn,
} from "@arco-design/web-vue";
import {
  Button, DialogPlugin, Empty, Input, Paragraph, Space, Typography
} from "tdesign-vue-next";
import {LoadingIcon} from "tdesign-icons-vue-next";

export default {

  confirm(content: string, title: string, config?: Partial<{
    confirmButtonText: string,
    cancelButtonText: string
  }>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const p = DialogPlugin({
        default: content,
        header: title,
        draggable: true,
        confirmBtn: {
          default: config?.confirmButtonText || ''
        },
        cancelBtn: {
          default: config?.cancelButtonText || ''
        },
        onConfirm: () => {
          p.destroy();
          resolve();
        },
        onCancel: () => {
          p.destroy();
          reject('cancel');
        },
        onClose: () => {
          p.destroy();
          reject('close');
        }
      })
    })
  },

  confirmMulti(content: string, title: string, buttons: Array<{ name: string, action: () => void }>): Promise<void> {
    return new Promise<void>(resolve => {
      const modalReturn = Modal.confirm({
        content,
        title,
        draggable: true,
        footer: () => <Space>
          <Button theme={'default'} onClick={modalReturn.close}>取消</Button>
          {buttons.map(btn => <Button theme={'primary'} onClick={() => {
            btn.action();
            resolve();
            modalReturn.close();
          }}>{btn.name}</Button>)}
        </Space>
      });
    })
  },

  alert(content: string, title?: string, config?: {
    confirmButtonText?: string,
    cancelButtonText?: string,
  }) {
    const {
      confirmButtonText = '确认',
      cancelButtonText = '取消',
    } = config || {};
    return new Promise<void>(resolve => {

      const res = DialogPlugin({
        default: () => <Paragraph>{content}</Paragraph>,
        top: 'auto',
        header: title,
        draggable: true,
        confirmBtn: {
          default: confirmButtonText,
        },
        cancelBtn: {
          default: cancelButtonText
        },
        onConfirm: () => {
          resolve();
          res.destroy();
        },
        onCancel() {
          res.destroy();
        },
        onClose() {
          res.destroy();
        }
      })
    })
  },

  prompt(content: string, title?: string, config?: {
    confirmButtonText?: string,
    cancelButtonText?: string,
    inputPattern?: RegExp,
    inputErrorMessage?: string,
    inputValue?: string,
    onClose?: () => void
  }): Promise<string> {
    const {
      inputValue = '',
      confirmButtonText = '确认',
      cancelButtonText = '取消',
      onClose
    } = config || {};
    return new Promise<string>(resolve => {
      let value = ref(inputValue);

      function onKeydown(value: string | number) {
        resolve(`${value}`);
        res.destroy();
      }

      const res = DialogPlugin({
        default: () => <div>
          <Paragraph>{content}</Paragraph>
          <Input autofocus={true} v-model={value.value} clearable={true} onEnter={onKeydown}></Input>
        </div>,
        top: 'auto',
        header: title,
        draggable: true,
        confirmBtn: {
          default: confirmButtonText,
        },
        cancelBtn: {
          default: cancelButtonText
        },
        onConfirm: () => {
          resolve(value.value);
          res.destroy();
        },
        onCancel() {
          res.destroy();
        },
        onClose() {
          res.destroy();
          onClose && onClose()
        }
      })
    })
  },

  loading(content: string, title?: string): MessageBoxLoadingReturn {
    const body = ref(content);
    const lines = ref(new Array<LineContent>());
    const res = Modal.open({
      title: title || '加载中',
      content: () => <Empty title={content} type={'empty'}>
        {{
          icon: () => <LoadingIcon/>,
          subtitle: () => {
            if (lines.value.length > 0) {
              return <Typography style={{maxHeight: "30vh", overflow: "auto"}}>
                {lines.value.map((line, index) =>
                  <Paragraph key={index} style={{color: renderColor(line.status)}}>
                    {line.content}
                  </Paragraph>)}
              </Typography>
            }
          }
        }}
      </Empty>,
      draggable: true,
      closable: false,
      footer: false,
      escToClose: false,
      maskClosable: false
    });
    return {
      ...res,
      setContent(content: string) {
        body.value = content;
      },
      append(line: string, status: LineContentStatus = 'info') {
        lines.value.unshift({content: line, status: status});
      }
    }
  }

}

export interface MessageBoxLoadingReturn extends ModalReturn {
  setContent(content: string): void;

  append(line: string, status?: LineContentStatus): void;
}

export interface LineContent {
  content: string;
  status: LineContentStatus;
}

export type LineContentStatus = 'success' | 'warning' | 'error' | 'info';

export function renderColor(status: LineContentStatus): string {
  switch (status) {
    case "success":
      return 'rgb(var(--green-6))';
    case 'warning':
      return 'rgb(var(--orange-6))';
    case "error":
      return 'rgb(var(--red-6))';
    default:
      return 'var(--color-neutral-10)';
  }
}
