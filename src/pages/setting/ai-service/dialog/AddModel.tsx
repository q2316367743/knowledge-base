import {DialogPlugin, Form, FormItem, Input, Textarea} from "tdesign-vue-next";
import {AiServiceModel, AiServiceModelType} from "@/entity/ai/AiService";

export function openAddModelDialog(): Promise<AiServiceModelType> {
  const data = ref<AiServiceModel>({
    id: '',
    label: '',
    description: '',
  })
  return new Promise<AiServiceModelType>(resolve => {
    const dp = DialogPlugin({
      header: '新增模型',
      placement: "center",
      draggable: true,
      confirmBtn: '新增',
      default: () => <Form data={data.value}>
        <FormItem label={"模型ID"} labelAlign={'top'}>
          <Input v-model={data.value.id} placeholder={"ID"}/>
        </FormItem>
        <FormItem label={"模型标签"} labelAlign={'top'}>
          <Input v-model={data.value.label} placeholder={"标签"}/>
        </FormItem>
        <FormItem label={"模型描述"} labelAlign={'top'}>
          <Textarea v-model={data.value.description} placeholder={"标签"} autosize={{minRows: 3, maxRows: 5}}/>
        </FormItem>
      </Form>,
      onConfirm: () => {
        resolve(data.value);
        dp.destroy();
      }
    })
  })
}