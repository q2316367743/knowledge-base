import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ref, watch} from "vue";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import {Alert, Button, Col, Drawer, Input, Row, Space} from "@arco-design/web-vue";
import {IconDelete} from "@arco-design/web-vue/es/icon";
import {clone} from "xe-utils";

export const useAiAskPromptStore = defineStore(LocalNameEnum.KEY_AI_PROMPT, () => {
    const prompts = ref<Array<string>>(getItemByDefault(LocalNameEnum.KEY_AI_PROMPT, new Array<string>()));

    function save(items: Array<string>) {
        prompts.value = items;
        setItem(LocalNameEnum.KEY_AI_PROMPT, prompts.value);
    }

    return {prompts, save}

})

export function openAiAskPromptDrawer() {
    const {prompts, save} = useAiAskPromptStore();
    const items = ref(clone(prompts, true));

    function add(prompt: string) {
        items.value.push(prompt);
    }

    function remove(index: number) {
        items.value.splice(index, 1);
    }


    Drawer.open({
        title: '设置AI问答提示词',
        width: 400,
        okText: '保存',
        onOk() {
            save(items.value);
        },
        content: () => <Space direction={'vertical'} style='width: 100%'>
            <Alert type={'warning'}>新增、修改后请点击右下角保存</Alert>
            <Row>
                <Button type={'primary'} onClick={() => add('')}>新增</Button>
            </Row>
            {items.value.map((_prompt, index) => <Row gutter={16}>
                <Col span={18}>
                    <Input v-model={items.value[index]} allowClear/>
                </Col>
                <Col span={6}>
                    <Button type={'text'} onClick={() => remove(index)}>
                        {{
                            icon: () => <IconDelete/>
                        }}
                    </Button>
                </Col>
            </Row>)}
        </Space>
    })
}
