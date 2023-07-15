<template>
    <a-layout class="app">
        <a-layout-sider :collapsed="collapsed" :width="200" :collapsed-width="0">
            侧边栏
        </a-layout-sider>
        <a-layout-content>
            <router-view />
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";

export default defineComponent({
    name: '',
    data: () => ({

    }),
    computed: {
        ...mapState(useGlobalStore, ['collapsed'])
    }
});
</script>
<style scoped>

</style>
