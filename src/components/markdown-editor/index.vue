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

const props = defineProps(editorProps);
const emits = defineEmits(['update:modelValue']);

const instance = shallowRef<Cherry>();
const id = 'markdown-editor-' + new Date().getTime();
const size = useWindowSize();
const config: CherryConfig = {
    id: id,
    value: props.modelValue || '',
    previewer: {
        dom: false,
        className: 'markdown-content',
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
            'header',
            'bold',
            'italic',
            {
                strikethrough: ['strikethrough', 'underline', 'sub', 'sup', 'ruby'],
            },
            'size',
            'color',
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
            'export',
            'settings',
            'ScreenShotMenu'
        ],
        toolbarRight: ['fullScreen', '|'],
        bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', 'ruby', '|', 'size', 'color'], // array or false
        sidebar: ['mobilePreview', 'copy', 'theme'],
        customMenu: {
            ScreenShotMenu: useScreenShotMenu(instance),
        },
    },
    callback: {
        afterChange(value) {
            emits('update:modelValue', value);
        }
    }
};

const preview = computed(() => {
    if (props.preview) {
        return true;
    }
    return props.defaultModel === 'previewOnly';
})

onMounted(() => {
    instance.value = new Cherry(config);
    handleToolbar(preview.value);
});

watch(() => props.modelValue, value => {
    if (instance.value) {
        instance.value.setValue(value || "");
    }
});
watch(() => preview.value, value => handleToolbar(value));
watch(() => size.width.value, value => {
    if (instance.value) {
        if (!props.preview) {
            instance.value.switchModel(value > 1080 ? 'edit&preview' : 'editOnly');
        }
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
</script>
<style scoped>
.markdown-editor {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
