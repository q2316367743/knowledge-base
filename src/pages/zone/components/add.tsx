import { Input, Modal, Textarea} from "@arco-design/web-vue";
import {ref} from "vue";
import {IconLocation} from "@arco-design/web-vue/es/icon";
import {useZoneStore} from "@/store/db/ZoneStore";
import MessageUtil from "@/utils/MessageUtil";

export function openAddDialog(): Promise<void> {
    const zone = initData();

    return new Promise<void>(resolve => {
        const modalReturn = Modal.open({
            title: '新增动态',
            okText: '发布',
            draggable: true,
            content: () => <>
                {/*输入框*/}
                <Textarea
                    auto-size={{minRows: 2, maxRows: 8}} v-model={zone.value.content}
                    placeholder="有什么新鲜事想分享？（支持Markdown）"/>
                {/*地点*/}
                <Input placeholder="请输入地点" style="margin-top: 7px;">
                    {{prefix: () => <IconLocation/>}}
                </Input>
            </>,
            onOk() {
                useZoneStore().add({
                    location: zone.value.location,
                    tags: zone.value.tags
                }, {
                    body: zone.value.content
                })
                    .then(() => {
                        MessageUtil.success("发布成功");
                        modalReturn.close();
                        resolve();
                    })
                    .catch(e => MessageUtil.error("发布失败", e));
            },
        });
    })

}

const initData = () => {
    return ref({
        content: '',
        tags: new Array<string>(),
        location: '',
        type: 0,
    });
}
