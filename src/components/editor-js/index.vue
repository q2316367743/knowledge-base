<template>
    <div id="editor-js-editor"></div>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, PropType, watch} from "vue";
import './index.less';
import EditorJS from '@editorjs/editorjs';
import {useWindowSize} from "@vueuse/core";
import NotificationUtil from "@/utils/NotificationUtil";
import {renderConfig} from "@/components/editor-js/components/renderConfig";

const props = defineProps({
    modelValue: Object as PropType<any>,
    readOnly: {
        type: Boolean,
        required: false,
        default: false
    }
});
const emits = defineEmits(['update:modelValue']);

const size = useWindowSize();

let editor: EditorJS | null = null;

onMounted(() => {
    editor = new EditorJS(renderConfig(props.modelValue, props.readOnly, emits));
});

watch(() => props.readOnly, value => {
    if (editor) {
        if (editor.readOnly.isEnabled !== value) {
            editor.readOnly.toggle();
        }
    }
})

onUnmounted(() => {
    if (editor) {
        try {
            editor.destroy();
        } catch (e) {
            console.error(e);
        }
    }
});

let showNotification = false;
handleWidth(size.width.value);
watch(() => size.width.value, value => handleWidth(value));
function handleWidth(width:number) {
    if (showNotification) {
        return;
    }
    if (width < 1080) {
        NotificationUtil.warning("检测到宽度小于1080px，可能造成编辑器显示不全");
        showNotification = true;
    }
}
</script>
<style scoped>

</style>
