import {Ref} from "vue";
import {Drawer, Form, FormItem, Switch} from "@arco-design/web-vue";

export interface LogicFlowOption {
    mindMap: boolean
}

export function updateLogicFlowOption(option: Ref<LogicFlowOption>, onSave: () => void) {
    Drawer.open({
        title: '参数修改',
        content: () => <Form model={option.value} layout={'vertical'}>
            <FormItem label={'是否显示小地图'}>
                <Switch v-model={option.value.mindMap} />
            </FormItem>
        </Form>,
        okText: '保存',
        onOk: () => {
            onSave()
        },
    })
}
