<template>
    <div class="kb-todo-home">
        <card-todo-input/>
        <card-todo-container v-if="categoryId"/>
        <a-result v-else title="请先前往设置中选择代办清单" />
        <div class="setting">
            <a-button type="text" @click="openSettingModal()">
                <template #icon>
                    <icon-settings/>
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useSettingStore} from "@/nested/todo/store";
import {computed, watch} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import CardTodoInput from "@/nested/todo/pages/home/components/CardTodoInput.vue";
import CardTodoContainer from "@/nested/todo/pages/home/components/CardTodoContainer.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const categoryId = computed(() => useSettingStore().categoryId);

watch(categoryId, value => {
    useTodoStore().setId(value || 0);
    useTodoStore().setCategoryId(value || 0);
}, {immediate: true})

function openSettingModal() {
    router.push('/setting');
}

</script>
<style scoped lang="less">
.kb-todo-home {
    padding: 7px;
    background-color: transparent;

    .setting {
        position: absolute;
        bottom: 7px;
        right: 7px;
    }

    .container {
        position: absolute;
        top: 47px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
}
</style>
