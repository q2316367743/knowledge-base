<template>
    <div ref="pluginRef" class="plugin-editor"></div>
</template>
<script lang="ts" setup>
import {PluginSettingIndex, PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";
import {onMounted, onUnmounted, PropType, ref, watch} from "vue";
import * as monaco from "monaco-editor";
import {useElementSize} from "@vueuse/core";
import {useGlobalStore} from "@/store/GlobalStore";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import lib from '../components/lib.txt?raw'

const props = defineProps({
    plugin: Object as PropType<PluginSettingIndex>
});

const pluginRef = ref();

const size = useElementSize(pluginRef);
const iDisposable = monaco.languages.typescript.javascriptDefaults.addExtraLib(lib, 'markdown-menu.d.ts');

onMounted(() => {

    if (!props.plugin) {
        return
    }

    const id = props.plugin.id;

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
    })

    let language = 'plaintext';
    if (props.plugin.type === PluginSettingTypeEnum.THEME) {
        language = 'css';
    }else if (props.plugin.type === PluginSettingTypeEnum.MARKDOWN_MENU) {
        language = 'javascript';
    }else if (props.plugin.type === PluginSettingTypeEnum.MARKDOWN_TEMPLATE) {
        language = 'markdown';
    }

    const editor = monaco.editor.create(pluginRef.value, {
        language: language,
        theme: useGlobalStore().isDark ? 'vs-dark' : 'vs',
    });

    async function init() {
        const {getContent, saveContent} = usePluginSettingStore();
        const res = await getContent(id);

        let rev = res.rev;
        if (res.record) {
            editor.setValue(res.record?.content);
        }


        // 监听值的变化
        editor.onDidChangeModelContent(() => {
            const value = editor.getValue()
            //给父组件实时返回最新文本
            saveContent(id, value, rev).then(r => {
                rev= r;
            }).catch(e => MessageUtil.error("保存失败", e));
        });

    }

    init();


    watch(() => useGlobalStore().isDark, value => editor.updateOptions({theme: value ? 'vs-dark' : 'vs'}));
    watch(() => size.width.value, () => editor && editor.layout());
    watch(() => size.height.value, () => editor && editor.layout());

});

onUnmounted(() => {
    iDisposable && iDisposable.dispose();
});


</script>
<style scoped>
.plugin-editor {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
