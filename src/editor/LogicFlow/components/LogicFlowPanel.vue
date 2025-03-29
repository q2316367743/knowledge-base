<template>
  <div class="logic-flow-panel">
    <div class="setting-block">
      <div>快捷样式</div>
      <div class="short-styles">
        <div v-for="(item, index) in shortStyles" :key="index"
             :style="{ 'backgroundColor': item.backgroundColor, 'borderColor': item.borderColor, 'borderWidth': item.borderWidth }"
             @click="setStyle(item)">
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-item">
        <span>背景色</span>
        <t-color-picker v-model="style.backgroundColor"
                        show-text :color-modes="['monochrome']" :recent-colors="false" :swatch-colors="[]"/>
      </div>
      <div class="setting-item">
        <span>线条颜色</span>
        <t-color-picker v-model="style.borderColor" default-value="#187DFF" show-text :color-modes="['monochrome']"
                        :recent-colors="false" :swatch-colors="[]"/>
      </div>
      <div class="setting-item">
        <span>线条样式</span>
        <t-select v-model="style.borderStyle" size="small">
          <t-option value="hidden" label="不显示"></t-option>
          <t-option value="solid">
            <div class="border-style" :style="{ borderBottomStyle: 'solid' }">实线</div>
          </t-option>
          <t-option value="dashed">
            <div class="border-style" :style="{ borderBottomStyle: 'dashed' }">虚线</div>
          </t-option>
          <t-option value="dotted">
            <div class="border-style" :style="{ borderBottomStyle: 'dotted' }">连续点</div>
          </t-option>
        </t-select>
      </div>
      <div class="setting-item">
        <span>线条宽度</span>
        <t-input-number v-model="style.borderWidth" size="small" :min="1" :max="100" suffix="px"/>
      </div>
      <div class="setting-item">
        <span>文本颜色</span>
        <t-color-picker v-model="style.fontColor" show-text :color-modes="['monochrome']" :recent-colors="false"
                        :swatch-colors="[]"/>
      </div>
      <div class="setting-item">
        <span>文本大小</span>
        <t-input-number v-model="style.fontSize" size="small" :min="12" :max="100" suffix="px"/>
      </div>
      <div class="setting-item">
        <span>文本字体</span>
        <t-select v-model="style.fontFamily" size="small" allow-clear>
          <t-option v-for="(fontFamily, index) in fontFamilies" :value="fontFamily" :key="index">
            {{ fontFamily }}
          </t-option>
        </t-select>
      </div>
      <div class="setting-item">
        <span>行高</span>
        <t-select v-model="style.lineHeight" size="small">
          <t-option v-for="(item, index) in lineHeightOptions" :key="index" :value="`${item}`">{{
              item
            }}
          </t-option>
        </t-select>
      </div>
      <div class="setting-item">
        <span>文本样式</span>
        <t-checkbox-group v-model="fontStyle" @change="syncFontStyle">
          <t-checkbox value="underline">U</t-checkbox>
          <t-checkbox value="bold">B</t-checkbox>
          <t-checkbox value="italic">I</t-checkbox>
        </t-checkbox-group>
      </div>
      <div style="margin-top: 14px;">
        <t-space size="small">
          <t-button variant="outline" @click="$emit('set-level', 'top')">置为顶部</t-button>
          <t-button variant="outline" @click="$emit('set-level', 'bottom')">置为底部</t-button>
        </t-space>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {borderStyles, fontFamilies, shortStyles} from '../constants'
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'logic-flow-panel',
  props: {
    elementsStyle: Object,
    onlyEdge: Boolean // 是否是只设置边的属性，当只设置边的属性时，隐藏快捷样式和背景色设置
  },
  emits: ['set-level', 'set-style'],
  data() {
    return {
      // 选项
      shortStyles,
      borderStyles,
      fontFamilies,
      borderWidthOptions: Array(11).fill(1).map((_, i) => i),
      lineHeightOptions: Array(5).fill(1).map((_, i) => _ + i * 0.5),
      // 样式
      style: {
        backgroundColor: '#ffffff', // 填充色
        borderType: 0, // 线条类型
        borderColor: '', // 填充颜色
        borderWidth: 1, // 线条宽度
        borderStyle: 'solid', // 线条类型
        fontSize: 12, // 文本大小
        fontColor: '#000000', // 文本颜色
        fontWeight: '', // 文本加粗
        fontFamily: '', // 文本样式
        lineHeight: '1', // 行高
        textAlign: 'center', // 对齐
        fontStyle: '',
        textDecoration: ''
      } as Record<string, any>,
      fontStyle: new Array<string>()
    }
  },
  watch: {
    style: {
      handler() {
        this.sync()
      },
      deep: true
    }
  },
  created() {
    this.fontStyle = new Array<string>();
    this.style = Object.assign({
      backgroundColor: '#ffffff', // 填充色
      borderType: 0, // 线条类型
      borderColor: '', // 填充颜色
      borderWidth: 2, // 线条宽度
      borderStyle: 'solid', // 线条类型
      fontSize: 12, // 文本大小
      fontColor: '#000000', // 文本颜色
      fontWeight: '', // 文本加粗
      fontFamily: '', // 文本样式
      lineHeight: '1', // 行高
      textAlign: 'center', // 对齐
      fontStyle: '',
      textDecoration: ''
    }, this.elementsStyle || {});
    if (this.style.textDecoration === 'underline') {
      this.fontStyle.push('underline')
    }
    if (this.style.fontWeight === 'bold') {
      this.fontStyle.push('bold')
    }
    if (this.style.fontStyle === 'italic') {
      this.fontStyle.push('italic')
    }
  },
  methods: {
    sync() {
      this.$emit('set-style', this.style)
    },
    setStyle(item: any) {
      this.style = Object.assign(this.style, item);
    },
    syncFontStyle() {
      if (this.fontStyle.indexOf('underline') > -1) {
        this.style.textDecoration = 'underline'
      } else {
        this.style.textDecoration = 'none'
      }
      if (this.fontStyle.indexOf('italic') > -1) {
        this.style.fontStyle = 'italic'
      } else {
        this.style.fontStyle = 'none'
      }
      if (this.fontStyle.indexOf('bold') > -1) {
        this.style.fontWeight = 'bold'
      } else {
        this.style.fontWeight = 'normal'
      }
    },
  },
})
</script>

<style scoped lang="less">
.logic-flow-panel {
  width: 236px;
  background-color: var(--td-bg-color-container);
  padding: 8px;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

.short-styles {
  width: 240px;
  margin-top: 14px;

  & > div {
    width: 20px;
    height: 20px;
    margin: 0 10px 5px 0;
    box-sizing: border-box;
    float: left;
    border: 1px solid #fff;
    cursor: pointer;
  }
}


.border-style {
  width: 150px;
  height: 0;
  margin-top: 18px;
  border-bottom-width: 1px;
  border-bottom-color: black;
}

.setting-block {
  overflow: hidden;
}

.setting-item {
  line-height: 12px;
  font-size: 12px;
  display: flex;
  vertical-align: middle;
  align-items: center;
  margin-top: 10px;
}

.setting-item {
  & > span {
    margin-right: 10px;
    text-align: right;
    flex-shrink: 0;
    flex-grow: 0;

    &:first-child {
      width: 48px;
    }
  }
}

.border-color {
  width: 40px;
  height: 30px;
  display: inline-block;
  border: 1px solid #eaeaeb;
}
</style>
