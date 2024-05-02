import {Button, Col, Drawer, Input, Row, Space, TreeSelect} from "@arco-design/web-vue";
import {useFolderStore} from "@/store/db/FolderStore";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";
import {ref} from "vue";
import {clone} from "xe-utils";
import {createCustomerFileNameSetting, CustomerFileNameSetting} from "@/entity/setting/CustomerFileNameSetting";

export function openCustomerFileNameDrawer() {
    const {folderTree} = useFolderStore();
    const {customerFileNames, init} = useCustomerFileNameStore();

    const items = ref<Array<CustomerFileNameSetting>>([]);
    init().then(() => items.value = clone(customerFileNames, true));

    function add() {
        items.value.push(createCustomerFileNameSetting());
    }

    Drawer.open({
        title: '自定义文件名',
        width: 600,
        content: () => <div>
            <div class={'mb-5'}><Button type={'primary'} onClick={add}>新增</Button></div>
            <Space direction={'vertical'}>
                {items.value.map(item => <Row gutter={16}>
                    <Col span={8}>
                        <TreeSelect data={folderTree} v-model={item.folderId}></TreeSelect>
                    </Col>
                    <Col span={8}>
                        <Input allowClear v-model={item.script}/>
                    </Col>
                    <Col span={8}>
                        <Button type={'primary'}>删除</Button>
                    </Col>
                </Row>)}
            </Space>
        </div>
    })
}
