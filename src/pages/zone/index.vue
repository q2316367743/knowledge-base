<template>
    <div class="zone">
        <!-- 容器 -->
        <div class="container">
            <a-list :bordered="false" :max-height="size.height" :scrollbar="true"
                    @reach-bottom="render()">
                <zone-item v-for="item in items" :zone="item" @remove="init()"/>
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
<script lang="ts">
import {mapState} from "pinia";
import {defineComponent} from 'vue';
import {useGlobalStore} from '@/store/GlobalStore';
import {useZoneStore} from "@/store/db/ZoneStore";
import ZoneAdd from "@/pages/zone/components/add.vue";
import ZoneItem from "@/pages/zone/components/item.vue";
import {ZoneIndex} from "@/entity/zone";

export default defineComponent({
    name: 'zone',
    components: {ZoneItem, ZoneAdd},
    data: () => ({
        items: new Array<ZoneIndex>(),
        bottom: false,
        lock: false,
        num: 1,
        pageSize: 5,
    }),
    computed: {
        ...mapState(useGlobalStore, ['admin', 'size']),
    },
    methods: {
        async render() {
            if (this.bottom) {
                return;
            }
            if (this.lock) {
                return;
            }
            this.lock = true
            const zones = await useZoneStore().page(this.num, this.pageSize);
            if (zones.length === 0) {
                this.bottom = true;
                return;
            }
            if (zones.length < this.pageSize) {
                this.bottom = true;
            }
            zones.forEach(zone => this.items.push(zone));
            this.lock = false;
            this.num += 1;
        },
        init() {
            this.lock = false;
            this.bottom = false;
            this.items = [];
            this.num = 1;
            this.pageSize = 5;
            this.render();
        }
    }
});
</script>
<style lang="less">
@import url(./index.less);
</style>
