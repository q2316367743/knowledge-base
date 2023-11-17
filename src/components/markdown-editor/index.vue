<template>
    <div class="markdown-editor" :id="id"></div>
</template>
<script lang="ts" setup>
import Cherry from "cherry-markdown";
import {computed, onMounted, shallowRef, watch} from "vue";
import {CherryConfig, editorProps} from "@/components/markdown-editor/CherryMarkdownOption";
import {useGlobalStore} from "@/store/GlobalStore";
import {useWindowSize} from "@vueuse/core";
import {useScreenShotMenu} from "@/components/markdown-editor/plugins/ScreenShotMenu";
import {useImageUpload, useLoadImageBySync} from "@/plugin/image";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import {TocItem} from "@/components/markdown-editor/common/TocItem";
import {usePanGu} from "@/components/markdown-editor/plugins/PanGuMenu";
import {useFanYi} from "@/components/markdown-editor/plugins/FanYiMenu";
import MessageUtil from "@/utils/MessageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {isUtools} from "@/global/BeanFactory";

const DEV_URL = "http://localhost:5173/#";

const props = defineProps(editorProps);
const emits = defineEmits(['update:modelValue']);
defineExpose({exportFile, getToc})

const instance = shallowRef<Cherry>();
const id = 'markdown-editor-' + new Date().getTime();
const size = useWindowSize();
const config: CherryConfig = {
    id: id,
    value: props.modelValue || '',
    previewer: {
        dom: false,
        enablePreviewerBubble: true,
        className: useBaseSettingStore().articleTheme
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
                        const id = url.replace("attachment:", "");
                        // TODO: 此种方法无法再web端使用
                        if (id.startsWith(LocalNameEnum.ARTICLE_ATTACHMENT)) {
                            return useLoadImageBySync(id)
                        } else {
                            return useLoadImageBySync(LocalNameEnum.ARTICLE_ATTACHMENT + id)
                        }
                    }
                }
                return url;
            }
        }
    },
    editor: {
        defaultModel: props.preview ? 'previewOnly' : props.defaultModel,
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
            'graph',
            'export'
        ],
        toolbarRight: ['fullScreen', '|'],
        bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'ruby', '|', 'PanGu', 'FanYi'], // array or false
        sidebar: ['theme', 'settings',],
        customMenu: {
            ScreenShotMenu: useScreenShotMenu(instance),
            PanGu: usePanGu(),
            FanYi: useFanYi(),
            YangShi: Cherry.createMenuHook("样式", {}),
            ZiTi: Cherry.createMenuHook("字体", {})
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
                    window.onImagePreview(src);
                }
            }
        },
        onCopyCode(event: Event, src: string) {
            console.log(event, src);
            return src;
        },
    },
    fileUpload(file, callback) {
        useImageUpload(file)
            .then(url => callback(url))
            .catch(e => MessageUtil.error("图片上传失败", e))

    }
};
if (isUtools) {
    // 只有是utools才需要截图
    config.toolbars?.toolbar?.push('ScreenShotMenu')
}

const preview = computed(() => {
    if (props.preview) {
        return true;
    }
    return props.defaultModel === 'previewOnly';
})

onMounted(() => {
    instance.value = new Cherry(config);
    handleToolbar(preview.value);
    handleTheme()
});

watch(() => preview.value, value => handleToolbar(value));
watch(() => size.width.value, value => {
    if (instance.value) {
        if (!props.preview) {
            instance.value.switchModel(value > 1080 ? 'edit&preview' : 'editOnly');
        }
    }
});
watch(() => useGlobalStore().isDark, value => {
    if (instance.value) {
        instance.value.setTheme(value ? 'dark' : 'default')
    }
})

function handleToolbar(value: boolean) {
    if (instance.value) {
        let toolbar = instance.value.status.toolbar;
        instance.value.switchModel(value ? 'previewOnly' : 'editOnly');
        // 工具栏
        if ((toolbar === 'show') === value) {
            try {
                instance.value.toolbar.menus.hooks.settings.toggleToolbar()
            } catch (e) {
                console.error(e)
            }
        }
    }
}

function handleTheme() {
    if (!instance.value) {
        return;
    }
    instance.value.setTheme(useGlobalStore().isDark ? 'dark' : 'default')
}

function exportFile(type: string, fileName: string) {
    if (instance.value) {
        console.log(type, fileName)
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
