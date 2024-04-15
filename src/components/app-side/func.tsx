import {Descriptions, DescriptionsItem, Drawer} from "@arco-design/web-vue";

export function openKeyDrawer() {
    Drawer.open({
        title: '快捷键',
        width: 350,
        footer: false,
        content: () => <Descriptions column={1} bordered>
            <DescriptionsItem label={'新建文章'}>
                Ctrl / Alt + N
            </DescriptionsItem>
            <DescriptionsItem label={'删除文章'}>
                Ctrl / Alt + Delete
            </DescriptionsItem>
        </Descriptions>
    })
}
