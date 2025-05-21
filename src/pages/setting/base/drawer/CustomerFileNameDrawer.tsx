import {Alert, Button, DrawerPlugin, Col,Input, Row, Space, TreeSelect} from 'tdesign-vue-next';
import {useFolderStore} from "@/store/db/FolderStore";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";
import {ref} from "vue";
import {clone} from "@/utils/lang/ObjectUtil";
import {createCustomerFileNameSetting, CustomerFileNameSetting} from "@/entity/setting/CustomerFileNameSetting";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openCustomerFileNameDrawer() {
  const {folderTree} = useFolderStore();
  const {init, save} = useCustomerFileNameStore();

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

  const dp =  DrawerPlugin({
    header: '更多自定义文件名规则',
    size: '600px',
    confirmBtn: '保存',
    default: () => <div>
      <Space direction={'vertical'} class={'w-full'}>
        <div><Button theme={'primary'} onClick={add}>新增</Button></div>
        <Alert theme={'warning'}>每一个规则都需要配置文件夹，不要重复配置文件夹，请勿配置为全部文件夹</Alert>
        {items.value.map((item, index) => <Row gutter={16}>
          <Col span={5}>
            <TreeSelect data={folderTree} v-model={item.folderId}></TreeSelect>
          </Col>
          <Col span={5}>
            <Input clearable={true} v-model={item.script}/>
          </Col>
          <Col span={2} class={'align-right'}>
            <Button theme={'danger'}  onClick={() => remove(index)}>删除</Button>
          </Col>
        </Row>)}
      </Space>
    </div>,
    onConfirm() {
      save(items.value)
        .then(() => dp.destroy?.())
        .catch(e => MessageUtil.error("保存失败", e))
    },
  })
}
