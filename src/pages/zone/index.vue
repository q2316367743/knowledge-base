<template>
    <div class="zone">
        <!-- 容器 -->
        <div class="container">
            <a-list :bordered="false" :max-height="size.height" :scrollbar="true"
                    @reach-bottom="render()">
                <zone-item v-for="item in items" :zone="item"/>
                <template #scroll-loading>
                    <div v-if="bottom">没有更多动态了</div>
                    <a-spin v-else/>
                </template>
            </a-list>
        </div>
        <!-- 新增动态 -->
        <zone-add/>
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
        // 显示数据
        startIndex: 0,
        bottom: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['admin', 'size']),
        ...mapState(useZoneStore, ['zones'])
    },
    methods: {
        render() {
            if (this.bottom) {
                return;
            }
            let zones = this.zones.slice(Math.max(this.startIndex, 0), Math.min(this.zones.length, this.startIndex + 5));
            zones = zones.sort((a, b) => Number(b.id) - Number(a.id));
            this.startIndex = Math.min(this.zones.length, this.startIndex + 5);
            if (this.startIndex === this.zones.length) {
                this.bottom = true;
            }
            for (let e of zones) {
                this.items.push(e);
            }
        },

    }
});
</script>
<style lang="less">
@import url(./index.less);
</style>
