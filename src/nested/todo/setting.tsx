import {computed, createApp, ref} from "vue";
import {Button, Form, FormItem, TreeSelect} from "@arco-design/web-vue";
import {IconLeft, IconSave} from "@arco-design/web-vue/es/icon";
import './setting.less';
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useSettingStore} from "@/nested/todo/store";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openSettingModal() {
    const settingDiv = document.createElement('div');
    document.body.appendChild(settingDiv);

    const setting = ref(useSettingStore().getSetting());
    const loading = ref(false);

    const {todoCategoryTree, todoCategoryMap} = useTodoCategoryStore();

    function onClose() {
        app.unmount();
        settingDiv.remove();
    }

    function onSave() {
        loading.value = true;
        useSettingStore().save(setting.value)
            .then(() => {
                MessageUtil.success("保存成功");
                onClose();
            }).catch(e => MessageUtil.error("保存失败", e))
            .finally(() => loading.value = false);
    }

    const app = createApp({
        render() {
            return <div class={'setting-modal'}>
                <div class={'header'}>
                    <span>
                        <Button type={'text'} onClick={onClose} loading={loading.value}>
                        {{
                            icon: () => <IconLeft/>
                        }}
                        </Button>
                        <span>设置</span>
                    </span>
                    <Button type={'text'} loading={loading.value} onClick={onSave}>
                        {{
                            icon: () => <IconSave/>
                        }}
                    </Button>
                </div>
                <div class={'container'}>
                    <Form model={{}} layout={'vertical'}>
                        <FormItem label={'当前清单'}>
                            <TreeSelect data={todoCategoryTree} allowClear allowSearch
                                        v-model={setting.value.categoryId}/>
                        </FormItem>
                    </Form>
                </div>
            </div>
        }
    });

    app.mount(settingDiv);
}
