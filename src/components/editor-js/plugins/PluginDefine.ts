import {BlockToolConstructorOptions} from "@editorjs/editorjs";

export abstract class PluginDefine<T extends any> {

    protected readonly data: T;
    protected readonly readonly: boolean;


    protected constructor(ops: BlockToolConstructorOptions) {
        this.data = ops.data;
        this.readonly = ops.readOnly;
    }

    static get toolbox(): PluginToolbox {
        return {
            title: '插件',
            icon: '',
        }
    }

    static get isReadOnlySupported() {
        return true;
    }

    abstract render(): HTMLElement;

    abstract save(blockContent: HTMLElement): T;

}

export interface PluginToolbox {

    // 插件名称
    title: string;

    // 插件图标
    icon: string;

}
