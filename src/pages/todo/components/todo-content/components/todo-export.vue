<template>
    <a-modal v-model:visible="visible" title="待办导出" draggable>
        <a-form :model="config" layout="vertical">
            <a-form-item label="时间范围">
                <a-range-picker v-model="config.rangeValue" :shortcuts="shortcuts"/>
            </a-form-item>
            <a-form-item label="是否包含日期">
                <a-switch v-model="config.includeTime"/>
                <template #help>
                    在代办前面显示日期
                </template>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="visible = false">取消</a-button>
            <a-button type="primary" @click="copyToClipboard()">复制到剪切板</a-button>
            <a-button type="primary" @click="exportTodo()">导出</a-button>
            "
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import dayjs from "dayjs";
import {ShortcutType} from "@arco-design/web-vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";

const props = defineProps({
    visible: Boolean
});
const emits = defineEmits(['update:visible']);

const visible = ref(props.visible);

watch(() => props.visible, value => visible.value = value);
watch(() => visible.value, value => emits('update:visible', value));

const config = ref({
    rangeValue: [dayjs().add(-1, 'week').format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD")],
    includeTime: false,
});

const shortcuts: ShortcutType[] = [
    {
        label: '上一周',
        value: () => [dayjs(), dayjs().add(-1, 'week')] as any[],
    },
    {
        label: '上个月',
        value: () => [dayjs(), dayjs().add(-1, 'month')],
    }
];

function exportTodo() {
    exportTo().then(text =>{
        const todoCategory = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().id);
        download(text, (todoCategory ? todoCategory.name : '待办导出') + '.txt', 'text/plain');
        visible.value = false;
    }).catch(e => MessageUtil.error("导出失败", e));
}

function copyToClipboard() {
    exportTo().then(text=> {
        utools.copyText(text);
        visible.value = false;
        MessageUtil.success("已成功复制到剪切板");
    }).catch(e => MessageUtil.error("导出失败", e));
}


function exportTo(): Promise<string> {
    const start = dayjs(config.value.rangeValue[0]).valueOf();
    const end = dayjs(config.value.rangeValue[1]).valueOf();
    const items = useTodoStore().todoItems.filter(e => e.id >= start && e.id <= end)
        .sort((a, b) => a.id - b.id);
    if (items.length === 0) {
        return Promise.reject("所选之间范围内没有待办");
    }
    return Promise.resolve(items.map(e => {
        let item = e.title;
        if (config.value.includeTime) {
            item = dayjs(e.id).format("YYYY-MM-DD") + ' ' + item;
        }
        return item;
    }).join("\n"));
}


</script>
<style scoped>

</style>
