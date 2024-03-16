import {Folder} from "@/entity/folder";
import {InputSearch, Modal, Tree} from "@arco-design/web-vue";
import {computed, ref} from "vue";
import {searchData} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {useWindowSize} from "@vueuse/core";
import {IconFolder} from "@arco-design/web-vue/es/icon";

export function openFolderChoose(defaultKey?: number): Promise<Folder> {
    return new Promise<Folder>(resolve => {
        const size = useWindowSize();

        const keyword = ref('');
        const selectedKeys = ref<Array<number>>([]);

        if (defaultKey) {
            selectedKeys.value.push(defaultKey);
        }

        const treeData = computed(() => useFolderStore().folderTree);
        const treeNodeData = computed(() => searchData(keyword.value, treeData.value));

        Modal.open({
            // @ts-ignore
            title: () => <InputSearch v-model={keyword.value} allowClear/>,
            content: () => <Tree v-model={[selectedKeys.value, 'selectedKeys']} data={treeNodeData.value}
                                 defaultExpandAll={true}
                                 blockNode virtualListProps={{height: size.height.value / 2}}>
                {{
                    icon: () => <IconFolder />
                }}
            </Tree>,
            okText: '移动',
            bodyClass: 'todo-item-article',
            width: '600px',
            titleAlign: "start",
            maskClosable: false,
            closable: false,
            onOk() {
                const id = selectedKeys.value[0];
                if (id) {
                    const folder = useFolderStore().folderMap.get(id);
                    if (folder) {
                        resolve(folder);
                    }
                }else {
                    resolve({
                        id,
                        name: '',
                        pid: 0,
                        createTime: new Date(),
                        updateTime: new Date()
                    });
                }
            }
        })
    })
}
