<template>
    <a-menu style="width: 200px;height: 100%;" breakpoint="xl" v-model:selected-keys="selectedKeys">
        <a-menu-item key="/home">
            <template #icon>
                <icon-home/>
            </template>
            主页
        </a-menu-item>
        <a-menu-item key="/zone">
            <template #icon>
                <icon-qq-zone/>
            </template>
            空间
        </a-menu-item>
        <a-menu-item key="/todo">
            <template #icon>
                <icon-check-square/>
            </template>
            待办
        </a-menu-item>
        <a-menu-item key="/timeline">
            <template #icon>
                <icon-time-line/>
            </template>
            时间线
        </a-menu-item>
        <a-sub-menu key="/graph">
            <template #icon>
                <icon-mind-mapping/>
            </template>
            <template #title>图</template>
            <a-menu-item key="/graph/relation">
                关联图
            </a-menu-item>
            <a-menu-item key="/graph/category">
                分类图
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="/setting">
            <template #icon>
                <icon-settings/>
            </template>
            <template #title>设置</template>
            <a-menu-item key="/setting/base">
                基础设置
            </a-menu-item>
            <a-menu-item key="/setting/category">
                分类设置
            </a-menu-item>
            <a-menu-item key="/setting/backup">
                备份设置
            </a-menu-item>
            <a-menu-item key="/setting/feature">
                关键字设置
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="/more">
            <template #icon>
                <icon-more/>
            </template>
            <template #title>更多</template>
            <a-menu-item key="/more/attachment">
                <template #icon>
                    <icon-attachment/>
                </template>
                附件
            </a-menu-item>
            <a-menu-item key="/more/recommend">
                <template #icon>
                    <icon-thumb-up/>
                </template>
                推荐
            </a-menu-item>
            <a-menu-item key="/more/about">
                <template #icon>
                    <icon-exclamation-circle/>
                </template>
                关于
            </a-menu-item>
        </a-sub-menu>
    </a-menu>
    <div class="app-exit">
        <a-tooltip content="退出" position="tr">
            <a-button type="text" @click="toLogin()">
                <template #icon>
                    <icon-import/>
                </template>
            </a-button>
        </a-tooltip>
    </div>
</template>
<script lang="ts" setup>
import IconTimeLine from "@/icon/IconTimeLine.vue";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

const selectedKeys = ref(['/dashboard']);

watch(() => selectedKeys.value, value => router.push(value[0]));
watch(() => route.path, path => {
    if (selectedKeys.value[0] !== path) {
        selectedKeys.value[0] = path;
    }
})

function toLogin() {
    router.push('/login');
}
</script>
<style scoped>
.app-exit {
    position: absolute;
    left: 8px;
    bottom: 8px;
}
</style>
