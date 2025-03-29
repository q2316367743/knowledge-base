<template>
  <div class="mind-map-setting">
    <t-tooltip content="主题">
      <t-button theme="primary" variant="text" size="small" @click="_openMindMapTheme()">
        <template #icon>
          <fill-color-icon/>
        </template>
      </t-button>
    </t-tooltip>
    <t-tooltip content="布局">
      <t-button theme="primary" variant="text" size="small" @click="_openMindMapLayout()">
        <template #icon>
          <layout-icon/>
        </template>
      </t-button>
    </t-tooltip>
    <t-button theme="primary" variant="text" size="small" @click="miniMap = !miniMap">
      <template #icon>
        <map-icon/>
      </template>
    </t-button>
    <t-tooltip content="快捷键">
      <t-button theme="primary" variant="text" size="small" @click="openMindMapShortcut()">
        <template #icon>
          <keyboard-icon/>
        </template>
      </t-button>
    </t-tooltip>
  </div>
  <mind-map-mini-map :mind-map="mindMap" v-if="miniMap"/>
</template>
<script lang="ts" setup>
import {PropType, ref} from "vue";
import MindMap from "simple-mind-map";
import MindMapMiniMap from "./MindMapMiniMap.vue";
import {openMindMapShortcut} from "./MindMapShortcut";
import {
  openMindMapTheme
} from "@/editor/MindMapEditor/components/MindMapSetting/MindMapTheme";
import {
  openMindMapLayout
} from "@/editor/MindMapEditor/components/MindMapSetting/MindMapLayout";
import {FillColorIcon, KeyboardIcon, LayoutIcon, MapIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  mindMap: Object as PropType<MindMap>
});

const miniMap = ref(false);

function _openMindMapTheme() {
  if (props.mindMap) {
    openMindMapTheme(props.mindMap)
  }
}

function _openMindMapLayout() {
  if (props.mindMap) {
    openMindMapLayout(props.mindMap);
  }
}
</script>
<style scoped>
.mind-map-setting {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: var(--td-text-color-primary);
  background: var(--color-fill-3);
  border-radius: 2px;
  padding: 3px 6px;
}
</style>
