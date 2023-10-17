<template>
    <div class="zone">
        <!-- 容器 -->
        <div class="container">
            <a-list :bordered="false" :max-height="size.height.value" :scrollbar="true"
                    @reach-bottom="render()">
                <zone-item v-for="item in items" :zone="item" @remove="init()" :key="item.id" :id="'zone-' + item.id"/>
                <template #scroll-loading>
                    <div v-if="bottom">没有更多动态了</div>
                    <a-spin v-else/>
                </template>
            </a-list>
        </div>
        <!-- 新增动态 -->
        <zone-add @add="init()"/>
        <a-back-top target-container=".zone .arco-scrollbar-container"/>
    </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import {useZoneStore} from "@/store/db/ZoneStore";
import ZoneAdd from "@/pages/zone/components/add.vue";
import ZoneItem from "@/pages/zone/components/item.vue";
import {ZoneIndex} from "@/entity/zone";
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize()

const items = ref(new Array<ZoneIndex>());
let bottom = false;
let lock = false;
let num = 1;
let pageSize = 5;


async function render() {
    if (bottom) {
        return;
    }
    if (lock) {
        return;
    }
    lock = true
    const zones = await useZoneStore().page(num, pageSize);
    if (zones.length === 0) {
        bottom = true;
        return;
    }
    if (zones.length < pageSize) {
        bottom = true;
    }
    zones.forEach(zone => items.value.push(zone));
    lock = false;
    num += 1;
}

function init() {
    lock = false;
    bottom = false;
    items.value = [];
    num = 1;
    pageSize = 5;
    render();
}

</script>
<style lang="less">
@import url(./index.less);
</style>
