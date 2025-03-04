import {Descriptions, DescriptionsItem, Drawer, Image, Modal} from "@arco-design/web-vue";
import reward from '@/assets/image/reward.png';

export function openKeyDrawer() {
    Drawer.open({
        title: '快捷键',
        width: 350,
        footer: false,
        content: () => <Descriptions column={1} bordered title={'首页有效'}>
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
    Modal.open({
        title:'赏赞',
        footer: false,
        width: 440,
        content: () => <Image src={reward} width={400} height={400}></Image>
    })
}
