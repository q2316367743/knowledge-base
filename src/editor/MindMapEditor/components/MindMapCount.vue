<template>
    <div class="mind-map-count">
        <div class="item">
            <span class="name">节点数</span>
            <span class="value">{{ num }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import MindMap from 'simple-mind-map';
import {onMounted, onBeforeUnmount, PropType, ref} from "vue";

const props = defineProps({
    mindMap: Object as PropType<MindMap>
});

const num = ref(0);


onMounted(() => {
    if (props.mindMap) {
        props.mindMap.on('data_change', onDataChange);
        onDataChange(props.mindMap.getData(false));
    }
});

onBeforeUnmount(() => {
    if (props.mindMap) {
        props.mindMap.off('data_change', onDataChange);
    }
})

function onDataChange(data: any) {
    num.value = 0;
    walk(data)
}

function walk(data: any) {
    num.value++
    if (data && data.children && data.children.length > 0) {
        data.children.forEach((item: any) => {
            walk(item)
        })
    }
}


</script>

<style lang="less" scoped>
.mind-map-count {
    padding: 0 12px;
    position: absolute;
    left: 20px;
    bottom: 10px;
    color: var(--td-text-color-primary);
    background: var(--color-fill-3);
    border-radius: 2px;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    display: flex;
    user-select: none;
    opacity: .6;


    .item {
        margin-right: 15px;

        &:last-of-type {
            margin-right: 0;
        }

        .name {
            margin-right: 5px;
        }
    }
}

</style>
