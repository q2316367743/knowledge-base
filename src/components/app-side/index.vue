<template>
    <a-menu style="width: 200px;height: 100%;" breakpoint="xl" v-model:selected-keys="selectedKeys">
        <a-menu-item key="/home">
            <template #icon>
                <icon-home/>
            </template>
            主页
        </a-menu-item>
        <a-menu-item key="/todo">
            <template #icon>
                <icon-check-square/>
            </template>
            待办
        </a-menu-item>
        <a-sub-menu key="/graph">
            <template #icon>
                <icon-tool/>
            </template>
            <template #title>工具</template>
            <a-menu-item key="/tool/search">
                搜索内容
            </a-menu-item>
            <a-menu-item key="/tool/recycle">
                回收站
            </a-menu-item>
            <a-menu-item key="/tool/plugin">
                主题与插件
            </a-menu-item>
            <a-menu-item key="/tool/category">
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
            <a-menu-item key="/setting/lsky-pro">
                兰空图床
            </a-menu-item>
            <a-menu-item key="/setting/category">
                分类设置
            </a-menu-item>
            <a-menu-item key="/setting/feature" v-if="isUtools">
                关键字设置
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="/more">
            <template #icon>
                <icon-more/>
            </template>
            <template #title>更多</template>
            <a-menu-item key="/more/backup">
                <template #icon>
                    <icon-sync/>
                </template>
                备份
            </a-menu-item>
            <a-menu-item key="/more/attachment" v-if="isUtools">
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
            <!--            <a-menu-item key="/more/vip">-->
            <!--                <template #icon>-->
            <!--                    <icon-fire />-->
            <!--                </template>-->
            <!--                高级版-->
            <!--            </a-menu-item>-->
            <a-menu-item key="/more/update">
                <template #icon>
                    <icon-time-line/>
                </template>
                更新
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
        <a-dropdown position="tl">
            <a-button type="text">
                <template #icon>
                    <icon-palette/>
                </template>
            </a-button>
            <template #content>
                <a-doption @click="useGlobalStore().switchDarkColors(GlobalType.DARK)">
                    <template #icon>
                        <icon-moon/>
                    </template>
                    暗黑
                </a-doption>
                <a-doption @click="useGlobalStore().switchDarkColors(GlobalType.LIGHT)">
                    <template #icon>
                        <icon-sun/>
                    </template>
                    明亮
                </a-doption>
                <a-doption @click="useGlobalStore().switchDarkColors(GlobalType.AUTO)">
                    跟随系统
                </a-doption>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts" setup>
import IconTimeLine from "@/icon/IconTimeLine.vue";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {GlobalType, useGlobalStore} from "@/store/GlobalStore";
import {isUtools} from "@/global/BeanFactory";

const route = useRoute();
const router = useRouter();

const selectedKeys = ref(['/dashboard']);

watch(() => selectedKeys.value, value => router.push(value[0]));
watch(() => route.path, path => {
    if (selectedKeys.value[0] !== path) {
        selectedKeys.value[0] = path;
    }
});


</script>
<style scoped>
.app-exit {
    position: absolute;
    left: 8px;
    bottom: 8px;
}
</style>
