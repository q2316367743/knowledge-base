import {Alert, Button, Col, Drawer, Input, Row, Space, TreeSelect} from "@arco-design/web-vue";
import {useFolderStore} from "@/store/db/FolderStore";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";
import {ref} from "vue";
import {clone} from "@/utils/lang/ObjectUtil";
import {createCustomerFileNameSetting, CustomerFileNameSetting} from "@/entity/setting/CustomerFileNameSetting";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openCustomerFileNameDrawer() {
    const {folderTree} = useFolderStore();
    const { init, save} = useCustomerFileNameStore();

    const items = ref<Array<CustomerFileNameSetting>>([]);
    init().then(customerFileNames => {
        if (customerFileNames) {
            items.value = clone(customerFileNames, true)
        }
    });

    function add() {
        items.value.push(createCustomerFileNameSetting());
    }

    function remove(index: number) {
        items.value.splice(index, 1);
    }

    Drawer.open({
        title: '更多自定义文件名规则',
        width: 600,
        okText: '保存',
        content: () => <div>
            <Space direction={'vertical'} class={'w-full'}>
                <div><Button type={'primary'} onClick={add}>新增</Button></div>
                <Alert type={'warning'}>每一个规则都需要配置文件夹，不要重复配置文件夹，请勿配置为全部文件夹</Alert>
                {items.value.map((item, index) => <Row gutter={16}>
                    <Col span={10}>
                        <TreeSelect data={folderTree} v-model={item.folderId}></TreeSelect>
                    </Col>
                    <Col span={11}>
                        <Input allowClear v-model={item.script}/>
                    </Col>
                    <Col span={3} class={'align-right'}>
                        <Button type={'primary'} status={'danger'} onClick={() => remove(index)}>删除</Button>
                    </Col>
                </Row>)}
            </Space>
        </div>,
        onBeforeOk(): Promise<boolean> {
            console.log(items.value)
            return save(items.value).then(() => {
                return true;
            }).catch(e => {
                MessageUtil.error("保存失败", e);
                return false;
            })
        },
    })
}
