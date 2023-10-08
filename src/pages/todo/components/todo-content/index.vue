<template>
    <div class="todo-content">
        <header class="header">
            <a-button type="text" @click="switchCollapsed()">
                <template #icon>
                    <icon-menu />
                </template>
            </a-button>
            <div class="title">{{title}}</div>
            <a-button type="text">
                <template #icon>
                    <icon-export />
                </template>
                导出
            </a-button>
        </header>
        <main class="container">
            <div class="progress-container">
                <div class="tc-item tc-todo">
                    <a-typography-title>待办</a-typography-title>
                    <a-divider />
                </div>
                <div class="tc-item tc-doing">
                    <a-typography-title>进行中</a-typography-title>
                    <a-divider />
                </div>
                <div class="tc-item tc-complete">
                    <a-typography-title>已完成</a-typography-title>
                    <a-divider />
                </div>
            </div>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";

const title = computed(() => useTodoStore().title);

const switchCollapsed = () => useTodoStore().switchCollapsed();
</script>
<style lang="less">
.todo-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .header {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        display: grid;
        grid-template-columns: 32px 1fr 82px;
        .title {
            margin-left: 7px;
            line-height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .container {
        position: absolute;
        top: 46px;
        left: 0;
        right: 0;
        bottom: 0;
        .progress-container {
            width: 100%;
            height: 100%;
            overflow-x: scroll;
            display: flex;
            gap: 14px;
            flex-direction: row;
            justify-content: flex-start;
            .tc-item {
                width: 250px;
                min-width: 250px;
                max-width: 350px;
            }
            .tc-todo {
            }
        }
    }
}
</style>
