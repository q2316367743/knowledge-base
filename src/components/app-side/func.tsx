import {Descriptions, DescriptionsItem, Drawer} from "@arco-design/web-vue";

export function openKeyDrawer() {
    Drawer.open({
        title: '快捷键',
        width: 350,
        footer: false,
        content: () => <Descriptions column={1} bordered title={'首页有效'}>
            <DescriptionsItem label={'新建文章'}>
                Ctrl / Alt + N
            </DescriptionsItem>
            <DescriptionsItem label={'删除文章'}>
                Ctrl / Alt + Delete
            </DescriptionsItem>
            <DescriptionsItem label={'搜索文章内容'}>
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
