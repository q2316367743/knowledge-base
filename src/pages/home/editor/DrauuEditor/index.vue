<template>
    <div class="drauu-editor">
        <!-- 顶部 -->
        <div class="header">
            <div class="option">
                <a-button-group type="text">
                    <a-button title="后退" @click="undo" style="width: 32px;">↩️</a-button>
                    <a-button title="前进" @click="redo" style="width: 32px;">↪️</a-button>
                    <a-button title="清空" @click="clear" style="width: 32px;">🗑</a-button>
                    <a-dropdown trigger="click">
                        <a-button title="导出" style="width: 32px;">📥</a-button>
                        <template #content>
                            <a-doption @click="downloadToSvg">SVG</a-doption>
                            <a-doption @click="downloadToPng">PNG</a-doption>
                        </template>
                    </a-dropdown>
                </a-button-group>
            </div>
            <a-divider direction="vertical" style="height: 32px"/>
            <div class="color-group">
                <div class="color-item" :class="color === '#f2f2f2' ? 'active' : ''" @click="color = '#f2f2f2'">⚪</div>
                <div class="color-item" :class="color === '#000000' ? 'active' : ''" @click="color = '#000000'">⚫️</div>
                <div class="color-item" :class="color === '#ed153d' ? 'active' : ''" @click="color = '#ed153d'">🔴</div>
                <div class="color-item" :class="color === '#ed9a26' ? 'active' : ''" @click="color = '#ed9a26'">🟠</div>
                <div class="color-item" :class="color === '#ede215' ? 'active' : ''" @click="color = '#ede215'">🟡</div>
                <div class="color-item" :class="color === '#30bd20' ? 'active' : ''" @click="color = '#30bd20'">🟢</div>
                <div class="color-item" :class="color === '#2656bf' ? 'active' : ''" @click="color = '#2656bf'">🔵</div>
                <div class="color-item" :class="color === '#c24aed' ? 'active' : ''" @click="color = '#c24aed'">🟣</div>
                <div class="color-item" :class="color === '#bf6b26' ? 'active' : ''" @click="color = '#bf6b26'">🟤</div>
            </div>
            <a-divider direction="vertical" style="height: 32px"/>
            <div class="thickness">
                <a-slider v-model="size" :min="1" :max="10" :step="0.5"
                          show-tooltip/>
            </div>
        </div>
        <!-- 左侧边栏 -->
        <div class="side">
            <div class="side-btn" :class="brush === 'stylus' ? 'active' : ''" @click="brush = 'stylus'">✍️</div>
            <div class="side-btn" :class="brush === 'draw' ? 'active' : ''" @click="brush = 'draw'">✏️</div>
            <div class="side-btn" :class="brush === 'line' ? 'active' : ''" @click="brush = 'line'">⁄</div>
            <div class="side-btn" :class="brush === 'arrow' ? 'active' : ''" @click="brush = 'arrow'">↘️</div>
            <div class="side-btn" :class="brush === 'rectangle' ? 'active' : ''" @click="brush = 'rectangle'">⃞</div>
            <div class="side-btn" :class="brush === 'ellipse' ? 'active' : ''" style="font-size: 26px;"
                 @click="brush = 'ellipse'">○
            </div>
            <div class="side-btn" :class="brush === 'text' ? 'active' : ''" @click="brush = 'text'">文</div>
            <div class="side-btn" :class="brush === 'eraseLine' ? 'active' : ''" @click="brush = 'eraseLine'">🧹</div>
            <a-divider/>
            <div class="side-btn" :class="{active: !dasharray}" @click="dasharray = undefined">—</div>
            <div class="side-btn" :class="{active: dasharray === '4'}" @click="dasharray = '4'">┅</div>
            <div class="side-btn" :class="{active: dasharray === '1 7'}" @click="dasharray = '1 7'">⋯</div>
        </div>
        <!-- 内容 -->
        <div class="drauu-view-wrap">
            <svg class="drauu-view" ref="target" style="touch-action: none"></svg>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {downloadByBase64, svg2png} from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {DrawingMode} from "@/components/drauu";
import {useDrauu} from "@/components/drauu/hooks";


const props = defineProps({
    modelValue: {
        type: String,
        default: "",
        required: false
    },
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const target = ref<SVGSVGElement>();

const color = ref('#000000');
const size = ref(3);
const brush = ref<DrawingMode | 'arrow'>("stylus");
const dasharray = ref<string>();
const drauu = useDrauu(target, {
    brush: {
        color: useGlobalStore().isDark ? '#f2f2f2' : '#000000',
        mode: 'stylus',
        size: 3,
        dasharray: 'solid'
    },
});

onMounted(() => {
    if (target.value) {
        target.value.innerHTML = props.modelValue
    }
    drauu.onChanged(() => {
        const instance = drauu.drauuInstance.value;
        if (!instance) {
            return;
        }
        const data = instance.el!.innerHTML || '';
        emits('update:modelValue', data);
    });

})


watch(() => color.value, value => drauu.brush.value.color = value);
watch(() => size.value, value => drauu.brush.value.size = value);
watch(() => brush.value, value => {
    console.log(value)
    if (value === 'arrow') {
        drauu.brush.value.mode = 'line';
        drauu.brush.value.arrowEnd = true;
    } else {
        drauu.brush.value.mode = value;
        drauu.brush.value.arrowEnd = false;
    }
});
watch(() => dasharray.value, value => drauu.brush.value.dasharray = value);

const undo = drauu.undo;
const redo = drauu.redo;
const clear = drauu.clear;

function downloadToSvg() {
    const instance = drauu.drauuInstance.value;
    if (!instance) {
        return;
    }
    instance.el!.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    const data = instance.el!.outerHTML || '';
    const blob = new Blob([data], {type: 'image/svg+xml'})
    const elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = 'drauu.svg'
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
}

function downloadToPng() {
    const instance = drauu.drauuInstance.value;
    if (!instance) {
        return;
    }
    svg2png(instance.el!)
        .then(e => downloadByBase64(e))
        .catch(e => MessageUtil.error("下载图片失败", e));
}

</script>
<style lang="less">
@import "./index.less";
</style>
