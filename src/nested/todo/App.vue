<template>
    <div class="app">
        <router-view />
    </div>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useSettingStore} from "@/nested/todo/store";


useGlobalStore().initDarkColors();
useTodoCategoryStore().init();
useSettingStore().init();


</script>
<style scoped>
.app {
    background-color: transparent;
}
</style>
