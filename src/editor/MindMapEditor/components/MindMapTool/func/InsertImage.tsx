import {Form, FormItem, Modal, Input, Row, Col, Button, InputGroup} from "@arco-design/web-vue";
import {ref} from "vue";
import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {getImageSize} from "@/utils/BrowserUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {useImageUploadByUtools} from "@/plugin/image";
import {renderAttachmentUrl} from "@/plugin/server";

export function openInsertImage(activeNodes: MindMapNode[]) {
    if (activeNodes.length === 0) {
        return;
    }
    const first = activeNodes[0];
    const data = ref({
        title: first.getData('imageTitle') || '',
        link: first.getData('image') || ''
    });

    function handleImageUpload() {
        window.preload.customer.openFile({
            title: '选择图片',
            buttonLabel: '选择',
            defaultPath: utools.getPath('pictures'),
            filters: [{
                name: 'Images',
                extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp']
            }]
        }).then(file => {
            useImageUploadByUtools(file)
                .then(key => {
                    data.value = {
                        title: file.name,
                        link: renderAttachmentUrl(key)
                    }
                })
        })
    }

    Modal.open({
        title: "图片",
        draggable: true,
        content: () => <Form model={data.value} layout={'vertical'}>
            <FormItem label={'图片链接'}>
                <InputGroup style={{width: '100%'}}>
                    <Input v-model={data.value.link}/>
                    <Button type={'primary'} onClick={handleImageUpload}>本地上传</Button>
                </InputGroup>
            </FormItem>
            <FormItem label={"图片标题（可选）"}>
                <Input v-model={data.value.title}/>
            </FormItem>
        </Form>,
        onOk() {
            let show = false;
            const timeout = setTimeout(() => {
                NotificationUtil.info("正在获取图片信息，请稍等...");
                show = true;
            }, 2000);
            getImageSize(data.value.link)
                .then(imageSize => {
                    if (show) {
                        NotificationUtil.success("获取完成");
                    }
                    clearTimeout(timeout);
                    activeNodes.forEach((node) => {
                        node.setImage({
                            url: data.value.link,
                            title: data.value.title,
                            width: imageSize.width,// 图片的宽高也不能少
                            height: imageSize.height
                        })
                    })
                });
        }
    })
}
