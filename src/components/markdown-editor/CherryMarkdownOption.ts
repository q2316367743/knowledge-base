import {PropType} from "vue";

export interface CherryConfig {
    // 选择器
    id: string;
    // 初始值
    value: string;
    // Third party package
    externals?: Record<string, any>;
    // engine configuration
    engine?: Engine;
    editor?: Editor;
    // toolbar configuration
    toolbars?: Toolbars;
    fileUpload?: (file: File, callback: (url: string) => void) => void;
    callback?: Callback;
    previewer?: Previewer;
    // The preview page does not need to bind events
    isPreviewOnly?: boolean;
    // The preview area automatically scrolls with the editor cursor
    autoScrollByCursor?: boolean;
    // Whether to force output to the body when the outer container does not exist
    forceAppend?: boolean;
    // The locale Cherry is going to use. Locales live in /src/locales/
    locale?: string;
}

interface Previewer {
    dom?: boolean;
    className?: string;
    // Whether to enable the editing ability of preview area (currently supports editing picture size and table content)
    enablePreviewerBubble?: boolean;
}

interface Callback {
    afterChange?: (value: string) => void;
    afterInit?: () => void;
    // 图片加载回调
    beforeImageMounted?: (e: Event, src: string) => void;
    // 预览区域点击事件
    onClickPreview?: (event: PointerEvent) => void,
    // 粘贴事件
    onCopyCode?: (event: Event, code: string) => string
}

interface Toolbars {
    // light or dark
    theme?: 'light' | 'dark';
    // False: the top toolbar is not displayed;
    // True: display toolbar;
    // toolbars. Showtoolbar = false and toolbars Toolbar = false equivalent
    showToolbar?: boolean;
    toolbar?: (Toolbar | string)[];
    toolbarRight?: (Toolbar | string)[];
    sidebar?: any[];
    bubble?: string[];
    float?: string[];
    customMenu?: Record<string, any>
}

interface Toolbar {
    [key: string]: string[]
}

interface Editor {
    // depend on codemirror theme name: https://codemirror.net/demo/theme.html
    // manual import theme: `import 'codemirror/theme/<theme-name>.css';`
    codemirror?: InlineCode;
    // The height of the editor is 100% by default. If the height of the mount point has an inline setting, the inline style will prevail
    height?: string;
    // defaultModel The default mode of the editor after initialization. There are three modes:
    // 1. Double column edit preview mode;
    // 2. Pure editing mode;
    // 3. Preview mode
    // edit&preview: Double column edit preview mode
    // editOnly: Pure editing mode (without preview, you can switch to double column or preview mode through toolbar)
    // previewOnly: Preview mode (there is no edit box, the toolbar only displays the "return to edit" button, which can be switched to edit mode through the toolbar)
    defaultModel?: EditorDefaultModel;
    // Whether to automatically convert HTML to markdown when pasting
    convertWhenPaste?: boolean;
}

export type EditorDefaultModel = 'editOnly' | 'edit&preview' | 'previewOnly'

interface Engine {
    // Global configuration
    global?: Global;
    // Built in syntax configuration
    syntax?: Syntax;
}

interface Syntax {
    // Syntax switch
    // 'hookName': false,
    // Syntax configuration
    // 'hookName': {
    //
    // }
    autoLink?: AutoLink;
    list?: List;
    // chartRenderEngine: EChartsTableEngine,
    // externals: ['echarts'],
    table?: Table;
    inlineCode?: InlineCode;
    codeBlock?: CodeBlock;
    // Whether to render using Unicode
    emoji?: Emoji;
    // Allow leading and trailing spaces
    fontEmphasis?: FontEmphasis;
    // Must there be a first space
    strikethrough?: Strikethrough;
    mathBlock?: MathBlock;
    inlineMath?: InlineMath;
    toc?: Toc;
    header?: Header;
}

interface Header {
    /**
     * Style of title：
     *  - default       Default style with anchor in front of title
     *  - autonumber    There is a self incrementing sequence number anchor in front of the title
     *  - none          Title has no anchor
     */
    anchorStyle: string;
}

interface Toc {
    /** By default, only one directory is rendered */
    allowMultiToc: boolean;
}

interface InlineMath {
    // katex or MathJax
    engine: 'katex' | 'MathJax';
    src: string;
}

interface MathBlock {
    // katex or MathJax
    engine: 'katex' | 'MathJax';
    src: string;
    // Default load plug-in
    plugins: boolean;
}

interface Strikethrough {
    needWhitespace: boolean;
}

interface FontEmphasis {
    allowWhitespace: boolean;
}

interface Emoji {
    useUnicode: boolean;
}

interface CodeBlock {
    // Default to dark theme
    theme?: string;
    // If it exceeds the length, whether to wrap the line. If false, the scroll bar will be displayed
    wrap?: boolean;
    // Default display line number
    lineNumber?: boolean;
    // Custom syntax renderer
    customRenderer?: Record<string, any>;
    /**
     * indentedCodeBlock Is the switch whether indent code block is enabled
     *
     *    this syntax is not supported by default in versions before 6.X.
     *    Because cherry's development team thinks the syntax is too ugly (easy to touch by mistake)
     *    The development team hopes to completely replace this syntax with ` ` code block syntax
     *    However, in the subsequent communication, the development team found that the syntax had better display effect in some scenarios
     *    Therefore, the development team in 6 This syntax was introduced in version X
     *    if you want to upgrade the following versions of services without users' awareness, you can remove this syntax:
     *        indentedCodeBlock：false
     */
    indentedCodeBlock?: boolean;
}

interface InlineCode {
    theme: string;
}

interface Table {
    enableChart: boolean;
}

interface List {
    // The sibling list type becomes a child after conversion
    listNested: boolean;
    // Default 2 space indents
    indentSpace: number;
}

interface AutoLink {
    /** default open short link display */
    enableShortLink: boolean;
    /** default display 20 characters */
    shortLinkLength: number;
}

interface Global {
    // Enable classic new line logic
    // true：One line break is ignored and more than two consecutive lines break into paragraphs
    // false： One line break will turn into < br >, two consecutive line breaks will be divided into paragraphs, and more than three consecutive line breaks will turn into < br > and divide into paragraphs
    classicBr?: boolean;
    /**
     * Additional HTML tags that allow rendering
     * Labels are separated by vertical lines in English，such as htmlWhiteList: 'iframe|script|style'
     * It is empty by default. See Src / utils / sanitize.html for the HTML allowed to be rendered by default JS whitelist property
     * attention：
     *    - After enabling iframe, script and other tags, XSS injection will be generated. Please judge whether it needs to be enabled according to the actual scene
     *    - Generally, scenes with controllable editing permissions (such as API document system) can allow iframe, script and other tags
     */
    htmlWhiteList?: string;
    /**
     * global URL processor
     * @param {string} url 来源url
     * @param {'image'|'audio'|'video'|'autolink'|'link'} srcType 来源类型
     * @returns
     */
    urlProcessor?: (url: string, srcType: 'image' | 'audio' | 'video' | 'autolink' | 'link') => string
}


export const editorProps = {
    modelValue: String,
    config: Object as PropType<Omit<CherryConfig, 'id' | 'value'>>,
    preview: {
        type: Boolean,
        required: false,
        default: false
    },
    defaultModel: {
        type: String as PropType<EditorDefaultModel>,
        required: false,
        default: 'editOnly'
    },
}
