<template>
  <div class="mind-map-mini-map">
    <div
      class="container"
      @mousedown="onMousedown"
      @mousemove="onMousemove"
      @mouseup="onMouseup"
    >
      <div
        class="miniMapContainer"
        ref="miniMapContainer"
        :style="{
            transform: `scale(${miniMapBoxScale})`,
            left: miniMapBoxLeft + 'px',
            top: miniMapBoxTop + 'px'
      		}"
      >

      </div>
      <div class="viewBoxContainer" :style="viewBoxStyle"></div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import MindMap from "simple-mind-map";

const props = defineProps({
  mindMap: Object as PropType<MindMap>
});


// 小地图容器的宽高
const containerWidth = 100
const containerHeight = 50

// 更新小地图
const miniMapContainer = ref<HTMLElement | null>(null)
const viewBoxStyle = ref({})
const miniMapBoxScale = ref(1)
const miniMapBoxLeft = ref(0)
const miniMapBoxTop = ref(0)

const updateMiniMp = () => {
  if (!props.mindMap || !miniMapContainer.value) {
    return;
  }
  // 计算小地图数据
  // @ts-ignore
  let data = props.mindMap.miniMap.calculationMiniMap(containerWidth, containerHeight)
  // 渲染到小地图
  miniMapContainer.value.innerHTML = data.svgHTML
  viewBoxStyle.value = data.viewBoxStyle
  miniMapBoxScale.value = data.miniMapBoxScale
  miniMapBoxLeft.value = data.miniMapBoxLeft
  miniMapBoxTop.value = data.miniMapBoxTop
}

const onMousedown = (e: MouseEvent) => {
  // @ts-ignore
  props.mindMap && props.mindMap.miniMap.onMousedown(e)
}

const onMousemove = (e: MouseEvent) => {
  // @ts-ignore
  props.mindMap && props.mindMap.miniMap.onMousemove(e)
}

const onMouseup = (e: MouseEvent) => {
  // @ts-ignore
  props.mindMap && props.mindMap.miniMap.onMouseup(e)
}


props.mindMap && props.mindMap.on('data_change', updateMiniMp);
props.mindMap && props.mindMap.on('view_data_change', updateMiniMp);
props.mindMap && props.mindMap.on('node_tree_render_end', updateMiniMp);

onMounted(updateMiniMp)

</script>
<style scoped lang="less">
.mind-map-mini-map {
  position: absolute;
  right: 10px;
  bottom: 50px;
  color: var(--td-text-color-primary);
  background: var(--color-fill-3);
  border-radius: 2px;
  padding: 3px 6px;
  width: 200px;
  height: 100px;

  .container {
    transform-origin: left top;
    position: absolute;
    left: 10px;
    top: 10px;
    width: 200px;
    height: 100px;
  }
}


.container {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 100px;
  height: 50px;
}

.miniMapContainer {
  position: absolute;
  transform-origin: left top;
}

.viewBoxContainer {
  position: absolute;
  border: 2px solid rgb(238, 69, 69);
  transition: all 0.3s;
}

</style>
