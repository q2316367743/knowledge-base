<template>
    <div class="timeline">
        <a-row :gutter="7" style="margin: 7px 4px">
            <a-col :span="6">
                <a-card>
                    <a-statistic title="文章" :value="articles.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="动态" :value="zones.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="分类" :value="categories.length" show-group-separator/>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="7" style="margin: 7px 4px;">
            <a-col :span="24">
                <a-card title="活跃图">
                    <template #extra>{{ endDate }}</template>
                    <calendar-heatmap :values="values" :dark-mode="isDark" :end-date="endDate"/>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts" setup>
import {computed, Ref, ref} from "vue";
import {CalendarHeatmap} from 'vue3-calendar-heatmap';
import {useArticleStore} from "@/store/db/ArticleStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useZoneStore} from "@/store/db/ZoneStore";

interface CalenderNode {
    date: string | Date,
    count: number
}

const articles = useArticleStore().articles;
const categories = useCategoryStore().categories;
const zones = useZoneStore().zones;
const isDark = computed(() => useGlobalStore().isDark);


const now = new Date();
now.setDate(now.getDate() + 1);
let month = now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)
let day = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate();
const endDate =  ref<any>(now.getFullYear() + '-' + month + '-' + day);
const values = ref<Array<CalenderNode>>(new Array<CalenderNode>()) as Ref<Array<CalenderNode>>;

const nodeMap = new Map<string, number>();
for (const item of [...articles, ...zones]) {
    let date = '';
    if (typeof item.createTime === 'string') {
        date = item.createTime.substring(0, 10);
    }else {
        let month = item.createTime.getMonth() < 9 ? ('0' + (item.createTime.getMonth() + 1)) : (item.createTime.getMonth() + 1)
        let day = item.createTime.getDate() < 10 ? ('0' + item.createTime.getDate()) : item.createTime.getDate();
        date = item.createTime.getFullYear() + '-' + month + '-' + day;
    }
    if (nodeMap.has(date)) {
        nodeMap.set(date, (nodeMap.get(date) || 1) + 1);
    } else {
        nodeMap.set(date, 1);
    }
}
nodeMap.forEach((value, key) => {
    values.value.push({
        date: key,
        count: value
    });
});

</script>
<style lang="less">
.timeline {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: auto;

    .vch__legend {
        margin-top: 7px;
    }

}
</style>
