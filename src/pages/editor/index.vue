<template>
    <div class="editor">
        <markdown-editor v-model="content" default-model="edit&preview" :preview="false"/>
    </div>
</template>
<script lang="ts" setup>
import MarkdownEditor from '@/components/markdown-editor/index.vue';
import {ref, watch} from "vue";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const content = ref(getItemByDefault<string>(LocalNameEnum.KEY_EDITOR_CONTENT, ""));
watch(() => content.value, value => setItem<string>(LocalNameEnum.KEY_EDITOR_CONTENT, value));
</script>
<style scoped>
.editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
