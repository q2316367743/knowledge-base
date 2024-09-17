declare module '@umoteam/editor' {
    import { DefineComponent } from 'vue';

    interface AssistantPayload{
        // 当前界面语言
        lang: string;
        // 用户选择的文本内容
        input: string;
        // 用户输入的指令
        command: string;
        // 文档助手希望得到的内容格式，可能的值：rich-text、text。
        output: 'rich-text' | 'text';
    }

    interface AssistantContent {
        // 当前文档的文本内容
        text: string;
        // 当前文档的HTML内容
        html: string;
        // 当前文档的JSON内容
        json: object;
    }

    /**
     * 编辑器配置
     * @see https://editor.umodoc.com/cn/docs/options/default
     */
    export interface UmoEditorOptions {
        editorKey: string;
        locale: string;
        theme: 'light' | 'dark';
        height: string;
        dicts: Dicts;
        toolbar: Toolbar;
        page: Page;
        document: Document;
        assistant: Assistant;
        shareUrl: string;
        templates: any[];
        cdnUrl: string;
        diagrams: Diagrams;
        file: FileOptions;
        user: Options;
        extensions: any[];
        translations: Translations;
        onSave(content: string, page: any, document: any): Promise<void>;
        onFileUpload(file: File): Promise<{
            id: string;
            url: string;
        }>;
        onFileDelete(id: string, url: string): void;
        onAssistant(payload: AssistantPayload, content: AssistantContent): Promise<void>;
        onCustomImportWordMethod(file: File): Promise<void>;
    }

    interface Translations {
        en_US: Options;
        zh_CN: Options;
    }

    interface FileOptions {
        allowedMimeTypes: any[];
        maxSize: number;
    }

    interface Diagrams {
        domain: string;
        params: Options;
    }

    interface Assistant {
        enabled: boolean;
        maxlength: number;
        commands: Command[];
    }

    interface Command {
        label: Label;
        value: Label;
        autoSend?: boolean;
    }

    interface Document {
        title: string;
        content: string;
        placeholder: Label;
        enableSpellcheck: boolean;
        enableMarkdown: boolean;
        enableBubbleMenu: boolean;
        enableBlockMenu: boolean;
        enableComment: boolean;
        readOnly: boolean;
        autofocus: boolean;
        characterLimit: number;
        typographyRules: Options;
        editorProps: Options;
        parseOptions: ParseOptions;
        autoSave: AutoSave;
    }

    interface AutoSave {
        enabled: boolean;
        interval: number;
    }

    interface ParseOptions {
        preserveWhitespace: string;
    }

    interface Page {
        defaultMargin: DefaultMargin;
        defaultOrientation: string;
        defaultBackground: string;
        watermark: Watermark;
        nodesComputedOption: NodesComputedOption;
    }

    interface NodesComputedOption {
        types: any[];
        nodesComputed: Options;
    }

    interface Watermark {
        type: string;
        alpha: number;
        fontColor: string;
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        text: string;
    }

    interface DefaultMargin {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }

    interface Toolbar {
        defaultMode: string;
        enableSourceEditor: boolean;
        menus: string[];
        disableMenuItems: any[];
        importWord: ImportWord;
    }

    interface ImportWord {
        enabled: boolean;
        options: Options;
        useCustomMethod: boolean;
    }

    interface Options {
    }

    interface Dicts {
        fonts: Font[];
        colors: string[];
        lineHeights: LineHeight[];
        symbols: Symbol[];
        emojis: Symbol[];
        pageSizes: PageSize[];
    }

    interface PageSize {
        label: Label | string;
        width: number;
        height: number;
        default?: boolean;
    }

    interface Symbol {
        label: Label;
        items: string;
    }

    interface LineHeight {
        label: Label;
        value: number;
        default?: boolean;
    }

    interface Font {
        label: Label | string;
        value?: string | null;
    }

    interface Label {
        en_US: string;
        zh_CN: string;
    }
    export const UmoEditor = DefineComponent<{}>({
        name: 'UmoEditor',
        emits: [],
        props: {} as Partial<UmoEditorOptions>,
    });
}
