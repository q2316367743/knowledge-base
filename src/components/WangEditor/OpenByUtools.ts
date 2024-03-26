import {DomEditor, IButtonMenu, IDomEditor} from '@wangeditor/editor'
import {LinkElement} from "@/components/WangEditor/LinkCard";

export class OpenByUtools implements IButtonMenu {

    readonly tag: string;
    readonly title: string;   // TS 语法

    constructor() {
        this.title = '打开链接' // 自定义菜单标题
        // this.iconSvg = '<svg>...</svg>' // 可选
        this.tag = 'button'
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor: IDomEditor): string | boolean {   // TS 语法
                                                       // getValue(editor) {                              // JS 语法
        return ' hello '
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor: IDomEditor): boolean {  // TS 语法
        // isActive(editor) {                    // JS 语法
        return false
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor: IDomEditor): boolean {   // TS 语法
                                                // isDisabled(editor) {                     // JS 语法
        return false
    }

    private getSelectedLinkElem(editor: IDomEditor): LinkElement | null {
        const node = DomEditor.getSelectedNodeByType(editor, 'link')
        if (node == null) return null
        return node as LinkElement
    }


    // 点击菜单时触发的函数
    exec(editor: IDomEditor, value: string | boolean) {
        if (this.isDisabled(editor)) return
        const linkElem = this.getSelectedLinkElem(editor)
        if (linkElem == null) return

        const { getLinkCardInfo } = editor.getMenuConfig('convertToLinkCard')
        if (typeof getLinkCardInfo !== 'function') return

        const { url } = linkElem;
        utools.shellOpenExternal(url);
    }

}

export const OpenByUtoolsMenu = {
    key: 'open-by-utools', // 定义 menu key ：要保证唯一、不重复（重要）
    factory() {
        return new OpenByUtools() // 把 `YourMenuClass` 替换为你菜单的 class
    },
}
