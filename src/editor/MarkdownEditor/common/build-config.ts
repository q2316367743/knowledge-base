import {isUtools} from "@/global/BeanFactory";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useImageUpload, useLoadImageBySync} from "@/plugin/image";
import {useGlobalStore} from "@/store/GlobalStore";
import {useScreenShotMenu} from "@/editor/MarkdownEditor/menu/ScreenShotMenu";
import {usePanGu} from "@/editor/MarkdownEditor/menu/PanGuMenu";
import {useFanYi} from "@/editor/MarkdownEditor/menu/FanYiMenu";
import {useRelationMenu} from "@/editor/MarkdownEditor/menu/RelationMenu";
import {
    useAnWeiMenu, useMingRenMingYanMenu,
    usePyqMenu, useQingGanMenu, useTianGouRiJiMenu,
    useYiYanMenu
} from "@/editor/MarkdownEditor/menu/XiaRouMenu";
import Cherry from "cherry-markdown";
import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {Ref} from "vue";
import {CherryOptions} from "cherry-markdown/dist/types/Cherry";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {useAskAi} from "@/editor/MarkdownEditor/menu/AskAi";
import {RelationArticleSyntaxHook} from "@/editor/MarkdownEditor/syntax/RelationArticle";
import {useMoreItemMenu, useMoreMenu} from "@/editor/MarkdownEditor/menu/MoreMenu";

const DEV_URL = "http://localhost:5173/#";

export async function buildConfig(
    articleId: number,
    id: string,
    value: string,
    preview: boolean,
    instance: Ref<Cherry | undefined> | null,
    update: ((content: string) => void) | null,
    sendToChat: ((content: string) => void) | null): Promise<CherryOptions> {

    const {defaultModel, classicBr} = useBaseSettingStore();

    // 默认模式
    const model = preview ?
        'previewOnly' : defaultModel;

    const toolbar = [];
    const bubble: Array<string> = [];

    if (useChatSettingStore().enable) {
        toolbar.push('AI')
        bubble.push('AI', '|');
    }

    toolbar.push(...[
        'quote',
        'header',
        {
            YangShi: [
                'bold',
                'italic', 'strikethrough', 'underline', 'sub', 'sup', 'ruby'],
        },
        {
            ZiTi: [
                'size',
                'color']
        },
        '|',
        {
            checklist: ['ol', 'ul', 'checklist']
        },
        'panel',
        'justify',
        'detail',
        '|',
        {
            insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word', 'ruby'],
        },
        {
            WenAn: ['YiYan', 'AnWei', 'Pyq', 'TianGouRiJi', 'QingGan', 'MingRenMingYan']
        },
        'graph',
        'Relation',
    ]);
    bubble.push(...['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'ruby', '|', 'PanGu', 'FanYi'])

    if (isUtools) {
        // 只有是utools才需要截图
        toolbar.push('ScreenShotMenu')
    }

    let customMenu: Record<string, any> = {};
    if (instance && sendToChat) {

        customMenu = {
            // 菜单
            AI: useAskAi(articleId, sendToChat),
            ScreenShotMenu: useScreenShotMenu(instance),
            PanGu: usePanGu(),
            FanYi: useFanYi(),
            Relation: useRelationMenu(instance),
            // 夏柔API
            YiYan: useYiYanMenu(instance),
            AnWei: useAnWeiMenu(instance),
            Pyq: usePyqMenu(instance),
            TianGouRiJi: useTianGouRiJiMenu(instance),
            QingGan: useQingGanMenu(instance),
            MingRenMingYan: useMingRenMingYanMenu(instance),
            // 分组
            YangShi: Cherry.createMenuHook("样式", {}),
            ZiTi: Cherry.createMenuHook("字体", {}),
            WenAn: Cherry.createMenuHook("文案", {}),
            // 更多
            More: useMoreMenu
        }
        const plugins = await useMoreItemMenu(instance);
        if (plugins.length > 0) {
            plugins.forEach(plugin => customMenu[plugin.name] = plugin.hook);
            toolbar.push({
                More: [...plugins.map(plugin => plugin.name)],
            });
        }
    }

    return {
        id: id,
        value: value,
        previewer: {
            dom: false,
            enablePreviewerBubble: true,
        },
        isPreviewOnly: false,
        autoScrollByCursor: true,
        forceAppend: true,
        locale: 'zh_CN',
        engine: {
            syntax: {
                codeBlock: {
                    lineNumber: true
                },
                header: {
                    anchorStyle: 'none'
                },
                toc: {
                    allowMultiToc: false
                }
            },
            global: {
                urlProcessor: (url: string, srcType: string) => {
                    if (srcType === 'image') {
                        if (url.startsWith("attachment:")) {

                            if (isUtools) {
                                const id = url.replace("attachment:", "");
                                if (id.startsWith(LocalNameEnum.ARTICLE_ATTACHMENT)) {
                                    return useLoadImageBySync(id)
                                } else {
                                    return useLoadImageBySync(LocalNameEnum.ARTICLE_ATTACHMENT + id)
                                }
                            }
                        }
                    }
                    return url;
                },
                classicBr: classicBr
            },
            customSyntax: {
                RelationArticle: {
                    syntaxClass: RelationArticleSyntaxHook, // 将自定义语法对象挂载到 importHook.syntaxClass上
                    force: false, // true： 当cherry自带的语法中也有一个“importHook”时，用自定义的语法覆盖默认语法； false：不覆盖
                    before: 'fontEmphasis', // 定义该自定义语法的执行顺序，当前例子表明在加粗/斜体语法前执行该自定义语法
                },
            },
        },
        editor: {
            defaultModel: model,
            codemirror: {
                theme: useGlobalStore().isDark ? 'material-ocean' : 'default',
            },
        },
        toolbars: {
            theme: useGlobalStore().isDark ? 'dark' : 'light',
            showToolbar: true,
            toolbar: toolbar,
            toolbarRight: ['fullScreen', '|'],
            bubble: bubble, // array or false
            sidebar: ['theme', 'settings'],
            toc: {
                updateLocationHash: false, // 要不要更新URL的hash
                defaultModel: 'pure', // pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题
            },
            customMenu
        },
        callback: {
            afterChange(value: string) {
                update && update(value)
            },
            onClickPreview(event: MouseEvent) {
                const aEle = event.target as HTMLElement;
                if (aEle) {
                    if (aEle.tagName === 'A') {
                        // 阻止默认行为和事件冒泡
                        event.preventDefault();
                        event.stopPropagation();
                        // @ts-ignore
                        const href = (aEle as HTMLLinkElement).href;
                        if (href.startsWith(DEV_URL)) {
                            // hash定位
                            event.preventDefault();
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            const id = href.replace(DEV_URL, "");
                            const target = document.getElementById(id);
                            if (target) {
                                target.scrollIntoView();
                            }
                            return;
                        }
                        if (!href.startsWith("http")) {
                            // hash定位
                            event.preventDefault();
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            const targetIndex = href.lastIndexOf("#");
                            if (targetIndex > -1) {
                                const id = href.substring(targetIndex + 1, href.length);
                                const target = document.getElementById(id);
                                if (target) {
                                    target.scrollIntoView();
                                }
                            }
                            return;
                        }
                        utools.shellOpenExternal(href);
                    } else if (aEle.tagName === 'IMG' || aEle.tagName === 'IMAGE') {
                        const src = (aEle as HTMLImageElement).src;
                        // @ts-ignore
                        window.onImagePreview(src);
                    } else if (aEle.classList.contains('relation-article')) {
                        const title = aEle.getAttribute('data-title');
                        if (title) {
                            const real = decodeURIComponent(title);
                            toArticleByRelation(real);
                        }
                    }
                }
            }
        },
        fileUpload(file: File, callback: (url: string) => void) {
            if (instance) {
                useImageUpload(file)
                    .then(url => {
                        if (instance.value) {
                            instance.value.insertValue(`![图片#100%](${url})`);
                        } else {
                            callback(url)
                        }
                    })
                    .catch(e => MessageUtil.error("图片上传失败", e))
            }

        },
    } as any;

}
