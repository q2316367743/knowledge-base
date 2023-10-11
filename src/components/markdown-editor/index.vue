<template>
    <div class="markdown-editor" :id="id"></div>
</template>
<script lang="ts" setup>
import Cherry from "cherry-markdown";
import {onMounted, shallowRef, watch} from "vue";
import {CherryConfig, editorProps} from "@/components/markdown-editor/MarkdownProp";
import {useGlobalStore} from "@/store/GlobalStore";

const props = defineProps(editorProps);
const emits = defineEmits(['update:moduleValue']);

const instance = shallowRef<Cherry>();
const id = 'markdown-editor-' + new Date().getTime();

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
                lineNumber:true
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
        showToolbar: false,
    },
    callback: {
        afterChange(value) {
            emits('update:moduleValue', value);
        }
    }
};

onMounted(() => {
    instance.value = new Cherry(config);
});

watch(() => props.modelValue, value => {
    if (instance.value) {
        instance.value.setValue(value || "");
    }
});
watch(() => props.preview, value => {
    if (typeof value !== 'undefined') {
        if (instance.value) {
            instance.value.switchModel(value ? 'previewOnly' : 'edit&preview');
        }
    }
});
</script>
<style scoped>
.markdown-editor {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
