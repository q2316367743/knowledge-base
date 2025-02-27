<template>
  <t-form :model="codeEditorSetting" >
    <t-form-item label="代码换行" label-align="top">
      <t-radio-group v-model="codeEditorSetting.wordWrap">
        <t-radio value="off">关闭</t-radio>
        <t-radio value="on">开启</t-radio>
        <t-radio value="wordWrapColumn">单词处换行</t-radio>
        <t-radio value="bounded">边界换行</t-radio>
      </t-radio-group>
    </t-form-item>
    <t-divider>小地图</t-divider>
    <t-paragraph>
      <t-checkbox v-model="codeEditorSetting.minimap.enabled">是否启用小地图</t-checkbox>
    </t-paragraph>
    <template v-if="codeEditorSetting.minimap.enabled">
      <t-paragraph>
        <t-checkbox v-model="codeEditorSetting.minimap.autohide">自动隐藏</t-checkbox>
      </t-paragraph>
      <t-paragraph>
        <t-checkbox v-model="codeEditorSetting.minimap.renderCharacters">渲染一行上的实际文本（而不是颜色块）。</t-checkbox>
      </t-paragraph>
      <t-form-item label="控制编辑器中的小地图的一侧" label-align="top">
        <t-radio-group v-model="codeEditorSetting.minimap.side">
          <t-radio value="right">右侧</t-radio>
          <t-radio value="left">左侧</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="控制小地图的渲染模式" label-align="top">
        <t-radio-group v-model="codeEditorSetting.minimap.showSlider">
          <t-radio value="always">总是显示</t-radio>
          <t-radio value="mouseover">鼠标移入显示</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="限制小地图的宽度，最多渲染一定数量的列。" label-align="top">
        <t-input-number v-model="codeEditorSetting.minimap.maxColumn" :min="0" :max="512"/>
      </t-form-item>
      <t-form-item label="小地图中字体的相对大小" label-align="top">
        <t-input-number v-model="codeEditorSetting.minimap.scale" :min="0.5" :max="2"/>
      </t-form-item>
    </template>
  </t-form>
</template>
<script lang="ts" setup>
import {codeEditorSetting} from "@/store/setting/CodeEditorSettingStore";
</script>
<style scoped lang="less">

</style>
