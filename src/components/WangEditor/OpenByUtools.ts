import {DomEditor, IButtonMenu, IDomEditor, SlateText} from '@wangeditor/editor'

// wangEditor 内部的 link elem
export type LinkElement = {
    type: 'link'
    url: string
    target?: string
    children: SlateText[]
}

export class OpenByUtools implements IButtonMenu {

    readonly tag: string;
    readonly title: string;   // TS 语法

    constructor() {
        this.title = '打开链接' // 自定义菜单标题
        // this.iconSvg = '<svg>...</svg>' // 可选
        this.tag = 'button';
    }

    getValue(): string | boolean {   // TS 语法
        return false
    }

    isActive(): boolean {
        return false
    }

    isDisabled(): boolean {
        return false
    }

    private getSelectedLinkElem(editor: IDomEditor): LinkElement | null {
        const node = DomEditor.getSelectedNodeByType(editor, 'link')
        if (node == null) return null
        return node as LinkElement
    }


    exec(editor: IDomEditor) {
        const linkElem = this.getSelectedLinkElem(editor);
        console.log(linkElem)
        if (linkElem == null) return
        const {url} = linkElem;
        utools.shellOpenExternal(url);
    }

}

export const OpenByUtoolsMenu = {
    key: 'open-by-utools', // 定义 menu key ：要保证唯一、不重复（重要）
    factory() {
        return new OpenByUtools() // 把 `YourMenuClass` 替换为你菜单的 class
    },
}
