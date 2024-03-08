<template>
    <div class="whiteboard-tool" v-if="leafer">
        <a-button type="text" @click="addRect()">
            <template #icon>
                <img alt="矩形" src="@/assets/icon/shape/rect.svg"/>
            </template>
        </a-button>
        <a-button type="text" @click="addEllipse()">
            <template #icon>
                <img alt="圆形" src="@/assets/icon/shape/ellipse.svg"/>
            </template>
        </a-button>
        <a-button type="text" @click="addArrow()">
            <template #icon>
                <img alt="箭头" src="@/assets/icon/shape/arrow.svg"/>
            </template>
        </a-button>
        <a-button type="text" @click="addText()">
            <template #icon>
                <img alt="文字" src="@/assets/icon/shape/text.svg"/>
            </template>
        </a-button>
    </div>
</template>
<script lang="ts" setup>
import {PropType} from "vue";
import {Ellipse, Leafer, Rect, Text} from "leafer-ui";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {Arrow} from "@leafer-in/arrow";

const props = defineProps({
    leafer: Object as PropType<Leafer>
});

function addRect() {
    console.log(props.leafer)
    if (!props.leafer) {
        return;
    }
    const rect = new Rect({
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        fill: '#32cd79',
        draggable: true,
        editable: true
    })

    props.leafer.app.tree.add(rect);
}

const addEllipse = () => props.leafer && props.leafer.add(new Ellipse({
    x: 107,
    y: 50,
    width: 50,
    height: 50,
    fill: '#FF4B4B',
    draggable: true,
    editable: true
}));

const addArrow = () => props.leafer && props.leafer.add(new Arrow({
    x: 221,
    y: 50,
    strokeWidth: 5,
    stroke: 'rgb(50,205,121)',
    draggable: true,
    editable: true
}));

function addText() {
    MessageBoxUtil.prompt("请输入内容")
        .then(text => props.leafer && props.leafer.add(new Text({
            x: 164,
            y: 50,
            fill: 'rgb(50,205,121)',
            text: text,
            fontSize: 24,
            draggable: true,
            editable: true
        })));
}
</script>
<style scoped>
.whiteboard-tool {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: var(--color-fill-2);
    color: var(--color-text-1);
    display: flex;
    flex-direction: column;
}
</style>
