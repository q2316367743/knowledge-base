<template>
    <div class="whiteboard-editor-wrap">
        <div ref="instance" class="whiteboard-editor" />
        <whiteboard-toolbar :leafer="leafer" />
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef} from "vue";
import {App, Leafer} from 'leafer-ui';
import { Editor } from '@leafer-in/editor'

import WhiteboardToolbar from './components/WhiteboardToolbar/index.vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: {},
        required: false
    },
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const instance = ref<HTMLDivElement>();
const leafer  = shallowRef<Leafer>()

onMounted(() => {


    const app = new App({ view: instance.value })

    app.tree = app.addLeafer()
    app.sky = app.addLeafer({ type: 'draw', usePartRender: false })

    app.editor = new Editor()
    app.sky.add(app.editor)

    // @ts-ignore
    leafer.value = app.tree;

})

</script>
<style>
.whiteboard-editor-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}
.whiteboard-editor {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
