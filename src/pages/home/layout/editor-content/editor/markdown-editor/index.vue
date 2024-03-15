<template>
    <div class="markdown-editor" :id="id"></div>
</template>
<script lang="ts" setup>
import Cherry from "cherry-markdown";
import {onMounted, onBeforeUnmount, shallowRef, watch} from "vue";
import {
    CherryConfig,
    editorProps
} from "@/pages/home/layout/editor-content/editor/markdown-editor/CherryMarkdownOption";
import {useWindowSize} from "@vueuse/core";

import {useScreenShotMenu} from "./menu/ScreenShotMenu";
import {usePanGu} from "./menu/PanGuMenu";
import {useFanYi} from "./menu/FanYiMenu";
import {
    useAnWeiMenu, useMingRenMingYanMenu,
    usePyqMenu, useQingGanMenu,
    useTianGouRiJiMenu,
    useYiYanMenu
} from "./menu/XiaRouMenu";

import {useImageUpload, useLoadImageBySync} from "@/plugin/image";

import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useArticleExportEvent, useArticleImportEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";

import MessageUtil from "@/utils/modal/MessageUtil";
import {extname, parseFileName, readAsText} from "@/utils/file/FileUtil";
import {docxToMarkdown, htmlToMarkdown} from "@/utils/file/ConvertUtil";

import {isUtools} from "@/global/BeanFactory";
import Constant from "@/global/Constant";

import {TocItem} from "./common/TocItem";
import {openMarkdownExport} from "./common/MarkdownExport";

import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

import {openArticleImport} from "@/pages/home/layout/editor-content/components/ArticleImport";

import {
    RelationArticleSyntaxHook
} from "./syntax/RelationArticle";

import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";

const DEV_URL = "http://localhost:5173/#";

const props = defineProps(editorProps);
const emits = defineEmits(['update:modelValue']);
defineExpose({exportFile, getToc})

const instance = shallowRef<Cherry>();
const id = 'markdown-editor-' + new Date().getTime();
const size = useWindowSize();

// 默认模式
const defaultModel = props.preview || useBaseSettingStore().mdEditorEditMode === MdEditorEditModeEnum.PREVIEW ?
    'previewOnly' : useBaseSettingStore().defaultModel;

const config: CherryConfig = {
    id: id,
    value: props.modelValue || '',
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
            urlProcessor: (url, srcType) => {
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
            }
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
        defaultModel: defaultModel,
        codemirror: {
            theme: useGlobalStore().isDark ? 'material-ocean' : 'default',
        },
    },
    toolbars: {
        theme: useGlobalStore().isDark ? 'dark' : 'light',
        showToolbar: true,
        toolbar: [
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
            'formula',
            {
                insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word', 'ruby'],
            },
            {
                WenAn: ['YiYan', 'AnWei', 'Pyq', 'TianGouRiJi', 'QingGan', 'MingRenMingYan']
            },
            'graph',
            'export'
        ],
        toolbarRight: ['fullScreen', '|'],
        bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'ruby', '|', 'PanGu', 'FanYi'], // array or false
        sidebar: ['theme', 'settings'],
        toc: {
            updateLocationHash: false, // 要不要更新URL的hash
            defaultModel: 'pure', // pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题
        },
        customMenu: {
            ScreenShotMenu: useScreenShotMenu(instance),
            PanGu: usePanGu(),
            FanYi: useFanYi(),
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
            WenAn: Cherry.createMenuHook("文案", {})
        },
    },
    callback: {
        afterChange(value) {
            emits('update:modelValue', value);
        },
        onClickPreview(event: PointerEvent) {
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
    fileUpload(file, callback) {
        useImageUpload(file)
            .then(url => callback(url))
            .catch(e => MessageUtil.error("图片上传失败", e))

    },
};
if (isUtools) {
    // 只有是utools才需要截图
    config.toolbars?.toolbar?.push('ScreenShotMenu')
}


onMounted(() => {
    instance.value = new Cherry(config as any);
    handleTheme();
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
    useArticleImportEvent.off(onImport);
    useArticleImportEvent.on(onImport);
});

onBeforeUnmount(() => {
    useArticleExportEvent.off(onExport);
    useArticleImportEvent.off(onImport);
});

watch(() => props.preview, handleToolbar);
watch(() => size.width.value, value => {
    if (instance.value) {
        if (useBaseSettingStore().mdEditorAutoMode && !props.preview) {
            instance.value.switchModel(value > Constant.autoCollapsedWidth ? 'edit&preview' : 'editOnly');
        }
    }
});
watch(() => useGlobalStore().isDark, value => {
    if (instance.value) {
        instance.value.setTheme(value ? 'dark' : 'default')
    }
})

function handleToolbar(value: boolean) {
    instance.value && instance.value.switchModel(value ? 'previewOnly' : useBaseSettingStore().defaultModel);
}

function handleTheme() {
    if (!instance.value) {
        return;
    }
    instance.value.setTheme(useGlobalStore().isDark ? 'dark' : 'default')
}

function exportFile(type: any, fileName: string) {
    if (instance.value) {
        instance.value.export(type, fileName);
    }
}


function getToc(): Array<TocItem> {
    if (instance.value) {
        return instance.value.getToc();
    } else {
        return [];
    }
}

function onExport(id: number) {
    if (props.articleId === id && instance.value) {
        openMarkdownExport(id, instance.value)
    }
}

function setValue(text: string, name: string, id: number) {
    instance.value && instance.value.setValue(text);
    const fileName = parseFileName(name);
    useArticleStore().updateIndex(id, {
        name: fileName
    }).then(() => useHomeEditorStore().updateTitle(id, fileName));
}

function onImport(id: number) {

    if (props.articleId === id && instance.value) {
        openArticleImport(['.md', '.markdown', '.html', '.docx'])
            .then(file => {
                const ext = extname(file.name);
                if (ext === 'md' || ext === 'markdown' || ext === 'html') {
                    readAsText(file).then(text => {
                        if (ext === 'html') {
                            text = htmlToMarkdown(text);
                        } else if (ext !== 'md' && ext !== 'markdown') {
                            MessageUtil.warning("文件类型不支持");
                            return;
                        }
                        setValue(text, file.name, id);
                    })
                } else if (ext === 'docx') {
                    file.arrayBuffer().then(arrayBuffer =>
                        docxToMarkdown(arrayBuffer).then(text =>
                            setValue(text, file.name, id)))
                }
            });
    }

}


</script>
<style lang="less">
.markdown-editor {
    position: relative;
    height: 100%;
    width: 100%;
}

.cherry {
    background-color: var(--color-bg-1);
    color: var(--color-text-1);

    .cherry-previewer {
        a {
            color: rgb(var(--arcoblue-6));
        }
    }
}
</style>
