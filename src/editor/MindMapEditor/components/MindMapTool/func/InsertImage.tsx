import {DialogPlugin, Form, FormItem, Input, Button, InputGroup} from "tdesign-vue-next";
import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {getImageSize} from "@/utils/BrowserUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {NativeUtil} from "@/utils/utools/NativeUtil";

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
    NativeUtil.customer.openFile({
      title: '选择图片',
      buttonLabel: '选择',
      defaultPath: InjectionUtil.getPath('pictures'),
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp']
      }]
    }).then(files => {
      const file = files[0];
      if (!file) {
        MessageUtil.error("未选择图片")
        return;
      }
      useAttachmentUpload.upload(file, file.name, "image/png")
        .then(({name, url}) => {
          data.value = {
            title: name,
            link: url
          }
        });
    })
  }

  const p = DialogPlugin({
    header: "图片",
    placement: 'center',
    draggable: true,
    default: () => <Form data={data.value} layout={'vertical'}>
      <FormItem label={'图片链接'} labelAlign={'top'}>
        <InputGroup style={{width: '100%'}}>
          <Input v-model={data.value.link}/>
          <Button theme={'primary'} onClick={handleImageUpload}>本地上传</Button>
        </InputGroup>
      </FormItem>
      <FormItem label={"图片标题（可选）"} labelAlign={'top'}>
        <Input v-model={data.value.title}/>
      </FormItem>
    </Form>,
    onConfirm() {
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
      p.destroy();
    }
  })
}
