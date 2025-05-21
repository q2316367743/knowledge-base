import {Descriptions, DescriptionsItem, DrawerPlugin} from "tdesign-vue-next";


export function openLogicFlowKeyboard() {
  DrawerPlugin({
    header: '快捷键',
    footer: false,
    size: '400px',
    default: () => <Descriptions title="节点操作" column={1} bordered>
      <DescriptionsItem label="保存">Ctrl + s</DescriptionsItem>
      <DescriptionsItem label="复制">Ctrl + c</DescriptionsItem>
      <DescriptionsItem label="粘贴">Ctrl + v</DescriptionsItem>
      <DescriptionsItem label="回退">Ctrl + Z</DescriptionsItem>
      <DescriptionsItem label="删除">backspace</DescriptionsItem>
      <DescriptionsItem label="小地图">Ctrl + m</DescriptionsItem>
      <DescriptionsItem label="选中">按住Ctrl + 鼠标左键拖动</DescriptionsItem>
      <DescriptionsItem label="放大/缩小">按住Ctrl + 滚轮</DescriptionsItem>
    </Descriptions>
  })
}
