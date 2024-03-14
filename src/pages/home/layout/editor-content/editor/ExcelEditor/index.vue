<template>
    <div class="excel-editor">
        <h1>表格笔记已不再支持</h1>
        <pre>{{ JSON.stringify(props.modelValue, null, 4) }}</pre>
    </div>
</template>
<script lang="ts" setup>
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


</script>
<style>
.excel-editor {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
