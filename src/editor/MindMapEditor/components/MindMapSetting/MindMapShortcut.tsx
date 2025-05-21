import {Descriptions, DescriptionsItem, DrawerPlugin} from 'tdesign-vue-next';

export function openMindMapShortcut() {
  DrawerPlugin({
    size: '400px',
    header: '快捷键',
    footer: false,
    default: () => <>
      <Descriptions column={1} title={'节点操作'} bordered>
        <DescriptionsItem label={'插入下级节点'}>Tab</DescriptionsItem>
        <DescriptionsItem label={'插入同级节点'}>Enter</DescriptionsItem>
        <DescriptionsItem label={'插入父节点'}>Shift + Tab</DescriptionsItem>
        <DescriptionsItem label={'插入概要'}>Ctrl + G</DescriptionsItem>
        <DescriptionsItem label={'展开/收起节点'}>/</DescriptionsItem>
        <DescriptionsItem label={'删除节点'}>Delete | Backspace</DescriptionsItem>
        <DescriptionsItem label={'进删除当前节点'}>Shift + Backspace</DescriptionsItem>
        <DescriptionsItem label={'复制节点'}>Ctrl + C</DescriptionsItem>
        <DescriptionsItem label={'剪切节点'}>Ctrl + X</DescriptionsItem>
        <DescriptionsItem label={'粘贴节点'}>Ctrl + V</DescriptionsItem>
        <DescriptionsItem label={'编辑节点'}>F2</DescriptionsItem>
        <DescriptionsItem label={'文本换行'}>Tab</DescriptionsItem>
        <DescriptionsItem label={'回退'}>Ctrl + Z</DescriptionsItem>
        <DescriptionsItem label={'前进'}>Ctrl + Y</DescriptionsItem>
        <DescriptionsItem label={'全选'}>Ctrl + A</DescriptionsItem>
      </Descriptions>
      <Descriptions column={1} title={'画布操作'} bordered class={'mt-16px'}>
        <DescriptionsItem label={'放大'}>Ctrl + +</DescriptionsItem>
        <DescriptionsItem label={'缩小'}>Ctrl + -</DescriptionsItem>
        <DescriptionsItem label={'放大/缩小'}>Ctrl + 鼠标滚动</DescriptionsItem>
        <DescriptionsItem label={'回到根节点'}>Ctrl + Enter</DescriptionsItem>
        <DescriptionsItem label={'适应画布'}>Ctrl + I</DescriptionsItem>
      </Descriptions>
      <Descriptions column={1} title={'大纲操作'} bordered class={'mt-16px'}>
        <DescriptionsItem label={'文本换行'}>Tab</DescriptionsItem>
        <DescriptionsItem label={'删除节点'}>Delete | Backspace</DescriptionsItem>
        <DescriptionsItem label={'插入下级节点'}>Tab</DescriptionsItem>
        <DescriptionsItem label={'插入同级节点'}>Enter</DescriptionsItem>
        <DescriptionsItem label={'上移一个层级'}>Shift + Tab</DescriptionsItem>
      </Descriptions>
    </>
  })
}
