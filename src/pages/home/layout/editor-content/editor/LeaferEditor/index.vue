<template>
    <div class="white-board-editor" ref="parentRef">
        <canvas ref="containerRef" />
        <leafer-tool v-if="load"/>
    </div>
</template>
<script lang="ts" setup>
import '@leafer-in/view'
import {onMounted, ref} from "vue";
// 组件
import LeaferTool from './components/LeaferTool/index.vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
        required: false
    },
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const parentRef = ref();
const containerRef = ref();
const load = ref(false);



onMounted(() => {
    load.value = true;
})


</script>
<style scoped>
.white-board-editor {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
