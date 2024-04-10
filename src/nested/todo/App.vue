<template>
    <div class="app kb-todo">
        <card-todo-input/>
        <card-todo-container/>
        <div class="setting">
            <a-button type="text" @click="openSettingModal()" size="mini">
                <template #icon>
                    <icon-settings/>
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {openSettingModal} from "@/nested/todo/setting";
import {useSettingStore} from "@/nested/todo/store";
import {computed, watch} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import CardTodoInput from "@/nested/todo/components/CardTodoInput.vue";
import CardTodoContainer from "@/nested/todo/components/CardTodoContainer.vue";


useGlobalStore().initDarkColors();
useTodoCategoryStore().init();
useSettingStore().init();


const categoryId = computed(() => useSettingStore().categoryId);

watch(categoryId, value => {
    value && useTodoStore().setId(value);
}, {immediate: true})


</script>
<style scoped lang="less">
.kb-todo {
    padding: 7px;

    .setting {
        position: absolute;
        bottom: 7px;
        right: 7px;
    }

    .container {
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
}
</style>
