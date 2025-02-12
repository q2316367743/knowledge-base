<template>
  <a-form :model="codeEditorSetting" layout="vertical">
    <a-form-item label="代码换行">
      <a-radio-group v-model="codeEditorSetting.wordWrap">
        <a-radio value="off">关闭</a-radio>
        <a-radio value="on">开启</a-radio>
        <a-radio value="wordWrapColumn">单词处换行</a-radio>
        <a-radio value="bounded">边界换行</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-divider>小地图</a-divider>
    <a-typography-paragraph>
      <a-checkbox v-model="codeEditorSetting.minimap.enabled">是否启用小地图</a-checkbox>
    </a-typography-paragraph>
    <template v-if="codeEditorSetting.minimap.enabled">
      <a-typography-paragraph>
        <a-checkbox v-model="codeEditorSetting.minimap.autohide">自动隐藏</a-checkbox>
      </a-typography-paragraph>
      <a-typography-paragraph>
        <a-checkbox v-model="codeEditorSetting.minimap.renderCharacters">渲染一行上的实际文本（而不是颜色块）。</a-checkbox>
      </a-typography-paragraph>
      <a-form-item label="控制编辑器中的小地图的一侧">
        <a-radio-group v-model="codeEditorSetting.minimap.side">
          <a-radio value="right">右侧</a-radio>
          <a-radio value="left">左侧</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="控制小地图的渲染模式">
        <a-radio-group v-model="codeEditorSetting.minimap.showSlider">
          <a-radio value="always">总是显示</a-radio>
          <a-radio value="mouseover">鼠标移入显示</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="限制小地图的宽度，最多渲染一定数量的列。">
        <a-input-number v-model="codeEditorSetting.minimap.maxColumn" :min="0" :max="512"/>
      </a-form-item>
      <a-form-item label="小地图中字体的相对大小">
        <a-input-number v-model="codeEditorSetting.minimap.scale" :min="0.5" :max="2"/>
      </a-form-item>
    </template>
  </a-form>
</template>
<script lang="ts" setup>
import {codeEditorSetting} from "@/store/setting/CodeEditorSettingStore";
</script>
<style scoped lang="less">

</style>
