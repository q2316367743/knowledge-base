import {Input, InputPassword, Modal, ModalReturn, Result, Typography, TypographyParagraph} from "@arco-design/web-vue";
import {h, ref, VNode} from "vue";
import Optional from "@/utils/Optional";
import {IconSync} from "@arco-design/web-vue/es/icon";

export default {

    confirm(content: string, title: string, config?: Partial<{
        confirmButtonText: string,
        cancelButtonText: string
    }>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content,
                title,
                draggable: true,
                okText: config ? config.confirmButtonText : '',
                cancelText: config ? config.cancelButtonText : '',
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    alert(content: string | VNode, title: string | null, config?: {
        confirmButtonText?: string,
        cancelButtonText?: string,
        width?: number
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content: typeof content === 'string' ? content : () => content,
                title: Optional.ofNullable(title).orElse("警告"),
                draggable: true,
                okText: Optional.ofNullable(config).map(e => e?.confirmButtonText).orElse('确定'),
                cancelText: Optional.ofNullable(config).map(e => e?.cancelButtonText).orElse('取消'),
                width: Optional.ofNullable(config).attr('width').orElse(undefined),
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    prompt(content: string, title: string, config: {
        confirmButtonText?: string,
        cancelButtonText?: string,
        inputPattern?: RegExp,
        inputErrorMessage?: string,
        inputValue?: string
    }): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let value = Optional.ofNullable(config.inputValue).orElse("") as string;
            const onInput = (e: string) => {
                value = e;
            }
            Modal.confirm({
                content: () => h('div', {class: 'es-prompt'}, [
                    h('div', {}, content),
                    // @ts-ignore
                    h(Input, {
                        type: 'text',
                        onInput,
                        "default-value": config.inputValue,
                        style: 'margin-top: 8px;',
                        onVnodeMounted: (e: VNode) => {
                            (e.el as HTMLInputElement)
                                .getElementsByTagName("input")
                                .item(0)!
                                .focus();
                        }
                    })
                ]),
                title: '提示',
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve(value);
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    password(content: string, title: string, config: {
        confirmButtonText?: string,
        cancelButtonText?: string
    }): Promise<{
        username: string;
        password: string;
    }> {
        return new Promise<{
            username: string;
            password: string;
        }>((resolve, reject) => {
            let value = {
                username: '',
                password: ''
            };
            const onUsernameInput = (e: string) => {
                value.username = e;
            }
            const onPasswordInput = (e: string) => {
                value.username = e;
            }
            Modal.confirm({
                content: () => h('div', {class: 'es-prompt'}, [
                    h('div', {}, content),
                    // @ts-ignore
                    h(Input, {
                        type: 'text',
                        onInput: onUsernameInput,
                        style: 'margin-top: 8px;',
                        onVnodeMounted: (e: VNode) => {
                            (e.el as HTMLInputElement)
                                .getElementsByTagName("input")
                                .item(0)!
                                .focus();
                        }
                    }),
                    h(InputPassword, {
                        type: 'text',
                        onInput: onPasswordInput,
                        style: 'margin-top: 8px;'
                    })
                ]),
                title: '提示',
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve(value);
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    loading(content: string, title?: string): MessageBoxLoadingReturn {
        const body = ref(content);
        const lines = ref(new Array<LineContent>());
        const res = Modal.open({
            title: title || '加载中',
            content: () => <Result title={content} status="info">
                {{
                    icon: () => <IconSync spin={true}/>,
                    subtitle: () => {
                        if (lines.value.length > 0) {
                            return <Typography style={{maxHeight: "30vh", overflow: "auto"}}>
                                {lines.value.map((line, index) =>
                                    <TypographyParagraph key={index} style={{color: renderColor(line.status)}}>
                                        {line.content}
                                    </TypographyParagraph>)}
                            </Typography>
                        }
                    }
                }}
            </Result>,
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
    setContent(content: string):void;
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
