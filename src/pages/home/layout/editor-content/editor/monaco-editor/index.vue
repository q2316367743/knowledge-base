<template>
    <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {editorProps} from './MonacoEditorType'
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor'
import {useGlobalStore} from "@/store/GlobalStore";

export default defineComponent({
    name: 'monaco-editor',
    props: editorProps,
    emits: ['update:modelValue', 'change', 'editor-mounted'],
    setup(props, {emit}) {
        self.MonacoEnvironment = {
            getWorker(_: string, label: string) {
                if (label === 'json') {
                    return new jsonWorker()
                }
                if (['css', 'scss', 'less'].includes(label)) {
                    return new cssWorker()
                }
                if (['html', 'handlebars', 'razor'].includes(label)) {
                    return new htmlWorker()
                }
                if (['typescript', 'javascript'].includes(label)) {
                    return new tsWorker()
                }
                return new EditorWorker()
            },
        }
        let editor: monaco.editor.IStandaloneCodeEditor
        const codeEditBox = ref()

        const init = () => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: false,
            })
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2020,
                allowNonTsExtensions: true,
            })

            editor = monaco.editor.create(codeEditBox.value, {
                value: props.modelValue,
                language: props.language,
                theme: useGlobalStore().isDark ? 'vs-dark' : 'vs',
                ...props.options,
                readOnly: props.readOnly
            })

            // 监听值的变化
            editor.onDidChangeModelContent(() => {
                const value = editor.getValue() //给父组件实时返回最新文本
                emit('update:modelValue', value)
                emit('change', value)
            })

            emit('editor-mounted', editor)
        }
        watch(
            () => props.modelValue,
            newValue => {
                if (editor) {
                    const value = editor.getValue()
                    if (newValue !== value) {
                        editor.setValue(newValue)
                    }
                }
            }
        )

        watch(
            () => props.options,
            newValue => {
                editor.updateOptions(newValue)
            },
            {deep: true}
        )

        watch(
            () => props.language,
            newValue => {
                monaco.editor.setModelLanguage(editor.getModel()!, newValue)
            }
        )

        watch(() => props.readOnly, value => {
            editor.updateOptions({readOnly: value});
        });

        watch(() => useGlobalStore().isDark, value => {
            editor.updateOptions({theme: value ? 'vs-dark' : 'vs'})
        })

        onBeforeUnmount(() => {
            editor.dispose()
        })

        onMounted(() => {
            init()
        })

        return {codeEditBox}
    },
})
</script>
<style lang="less" scoped>
.codeEditBox {
    position: relative;
    width: v-bind(width);
    height: v-bind(height);
}
</style>
