<template>
    <div class="todo-item-content">
        <a-result v-if="itemId === 0" status="404" title="请选择待办项"/>
        <a-typography v-show="itemId !== 0">
            <header class="header">
                <!-- 标题 -->
                <div class="title">
                    <a-input v-model="item.index.title" allow-clear placeholder="待办标题，回车修改"
                             @keydown.enter="updateTitle()"/>
                </div>
                <!-- 优先级 -->
                <a-dropdown position="br" @select="updatePriority($event)">
                    <a-button type="dashed" :style="{color: color}" class="priority">
                        <template #icon>
                            <icon-thunderbolt/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                                   :value="TodoItemPriority.HIGH">
                            高优先级
                        </a-doption>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                                   :value="TodoItemPriority.MIDDLE">
                            中优先级
                        </a-doption>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                                   :value="TodoItemPriority.FLOOR">
                            低优先级
                        </a-doption>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                                   :value="TodoItemPriority.NONE">
                            无优先级
                        </a-doption>
                    </template>
                </a-dropdown>
            </header>
            <main class="item-container">
                <!-- 工具栏 -->
                <div id="toolbar-container"></div>
                <!-- 内容 -->
                <editor-js v-model="source" v-if="show"/>
                <div id="todo-editor—wrapper">
                </div>
                <!-- 标签 -->
                <div class="todo-item-tags">
                    <a-tag v-for="tag in tags" :key="tag" :color="randomColor(tag)" closable
                           @close="tagRemove(tag)">{{ tag }}
                    </a-tag>
                    <a-input
                            v-if="tag.input"
                            ref="tagInputRef"
                            :style="{ width: '90px'}"
                            size="mini"
                            v-model.trim="tag.value"
                            @keyup.enter="tagAdd()"
                            @blur="tagAdd()"
                    />
                    <a-tag
                            v-else
                            @click="tagEdit()"
                    >
                        <template #icon>
                            <icon-plus/>
                        </template>
                        新增标签
                    </a-tag>
                </div>
            </main>
            <footer class="footer">
                <div></div>
                <a-button type="text">
                    <template #icon>
                        <icon-more-vertical/>
                    </template>
                </a-button>
            </footer>
            <div class="auto-save" v-if="autoSaveLoading">
                <icon-refresh spin/>
                自动保存中
            </div>
        </a-typography>
        <a-back-top target-container=".todo-item-content .item-container" style="bottom:56px"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, nextTick, ref, toRaw, watch} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItem, handlePriorityColor, TodoItem, TodoItemPriority} from "@/entity/todo/TodoItem";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useMagicKeys} from "@vueuse/core";
import {randomColor} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";
import EditorJs from '@/components/editor-js/index.vue';

let lock = false;
let todo = false;

const {ctrl, s} = useMagicKeys();


const item = ref<TodoItem>(getDefaultTodoItem());
const autoSaveLoading = ref(false);
const tagInputRef = ref<HTMLInputElement | null>(null);
const tag = ref({
    input: false,
    value: ''
});
const source = ref<any>({});
const show = ref(false);



const itemId = computed(() => useTodoStore().itemId);
const color = computed(() => handlePriorityColor(item.value.index.priority));
const createTime = computed(() => toDateString(item.value.index.createTime, "yyyy-MM-dd HH:mm:ss"));
const tags = computed(() => item.value.content.record.tags);


watch(() => itemId.value, value => init(value));
init(itemId.value);

function init(id: number) {
    show.value = false;
    if (id === 0) {
        return;
    }
    // 获取内容
    useGlobalStore().startLoading("获取待办内容中");
    useTodoStore().getTodoItem(id)
        .then(value => {
            item.value = value;
            // 重新设置编辑器的值
            source.value = value.content.record.source;
            show.value = true;
        })
        .catch(e => MessageUtil.error("获取待办内容失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

// 内容的自动保存
const autoSave = () => {
    if (lock) {
        todo = true;
        return;
    }
    autoSaveLoading.value = true;
    lock = true;
    saveOneByAsync(LocalNameEnum.TODO_ITEM + itemId.value, {
        ...item.value.content.record,
        tags: toRaw(item.value.content.record.tags),
        source: toRaw(source.value)
    }, item.value.content.rev)
        .then(rev => {
            item.value.content.rev = rev;
            lock = false;
            if (todo) {
                todo = false;
                autoSave()
            }
        })
        .catch(e => MessageUtil.error("自动保存内容失败", e))
        .finally(() => autoSaveLoading.value = false);
};


function updatePriority(priority: any) {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(itemId.value, {priority})
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => MessageUtil.error("更新失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

function updateTitle() {
    useTodoStore().updateById(item.value.index.id, {title: item.value.index.title})
        .catch(e => MessageUtil.error("更新标题失败", e));
}

watch(() => s.value, value => {
    if (value && ctrl.value) {
        updateTitle();
        autoSave()
    }
});

watch(() => item.value.index.title, () => updateTitle());
watch(() => source.value, () => autoSave())

function tagAdd() {
    tag.value.input = false;
    if (tag.value.value.trim().length === 0) {
        return;
    }
    const temp = tag.value.value.trim();
    if (item.value.content.record.tags.indexOf(temp) === -1) {
        item.value.content.record.tags.push(temp);
        autoSave();
    }
}

function tagEdit() {
    tag.value = {
        input: true,
        value: ''
    }
    nextTick(() => {
        if (tagInputRef.value) {
            tagInputRef.value.focus();
        }
    })
}

function tagRemove(tag: string) {
    item.value.content.record.tags.splice(item.value.content.record.tags.indexOf(tag), 1);
    autoSave();
}


</script>
<style lang="less">
.todo-item-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;

    .header {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;

        .title {
            position: absolute;
            top: 0;
            left: 0;
            right: 39px;
        }

        .priority {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    .item-container {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 46px;
        overflow: auto;


        .todo-item-tags {
            width: 100%;
            flex-wrap: wrap;

            .arco-tag {
                margin: 4px 7px;
            }
        }
    }

    .footer {
        position: absolute;
        left: 7px;
        right: 7px;
        bottom: 7px;
        display: flex;
        justify-content: space-between;
    }

    .auto-save {
        position: absolute;
        top: 53px;
        right: 7px;
        color: rgb(var(--arcoblue-6));
        line-height: 32px;

    }

}

</style>
