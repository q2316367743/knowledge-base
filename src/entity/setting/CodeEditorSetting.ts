export interface CodeEditorSetting {
  // 是否换行
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  minimap: {
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 控制小地图的渲染。
     */
    autohide?: boolean;
    /**
     * 控制编辑器中的小地图的一侧。
     */
    side?: 'right' | 'left';
    /**
     * 控制小地图滑块的渲染。
     */
    showSlider?: 'always' | 'mouseover';
    /**
     * 渲染一行上的实际文本（而不是颜色块）。
     */
    renderCharacters?: boolean;
    /**
     * 限制小地图的宽度，最多渲染一定数量的列。
     */
    maxColumn?: number;
    /**
     * 小地图中字体的相对大小
     */
    scale?: number;
  }
}

export function buildCodeEditorSetting(): CodeEditorSetting {
  return {
    wordWrap: 'off',
    minimap: {
      enabled: true,
      autohide: false,
      side: 'right',
      showSlider: 'mouseover',
      renderCharacters: true,
      maxColumn: 120,
      scale: 1
    }
  }
}