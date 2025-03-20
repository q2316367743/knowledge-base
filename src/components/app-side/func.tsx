import reward from '@/assets/image/reward.png';
import {Descriptions, DescriptionsItem, DialogPlugin, Image} from "tdesign-vue-next";

export function openKeyDrawer() {
  DialogPlugin({
    header: '快捷键',
    placement: 'center',
    width: 600,
    footer: false,
    default: () => <Descriptions column={1} bordered title={'首页有效'} layout={'vertical'} itemLayout={'horizontal'}>
      <DescriptionsItem label={'新建笔记'}>
        Ctrl / Alt + N
      </DescriptionsItem>
      <DescriptionsItem label={'删除笔记'}>
        Ctrl / Alt + Delete
      </DescriptionsItem>
      <DescriptionsItem label={'搜索笔记内容'}>
        Ctrl / Alt + Shift + F
      </DescriptionsItem>
      <DescriptionsItem label={'切换编辑/预览'}>
        Ctrl / Alt + Q
      </DescriptionsItem>
      <DescriptionsItem label={'打印'}>
        Ctrl / Alt + P
      </DescriptionsItem>
    </Descriptions>
  })
}

export function openShangZan() {
  DialogPlugin({
    header: '赏赞',
    footer: false,
    placement: 'center',
    width: 440,
    default: () => <Image src={reward}/>
  })
}
