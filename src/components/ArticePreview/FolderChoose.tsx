import {Folder} from "@/entity/folder";
import {Input, DialogPlugin, Tree} from "tdesign-vue-next";
import {searchData} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {FolderIcon} from 'tdesign-icons-vue-next';

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

    const p = DialogPlugin({
      header: () => <Input v-model={keyword.value} clearable={true}/>,
      default: () => <Tree v-model={[selectedKeys.value, 'actived']} data={treeNodeData.value} activable={true}
                           scroll={{type: 'virtual'}} expandAll={true} line={true}
                           style={{height: (size.height.value / 2) + 'px'}}>
        {{
          // @ts-ignore
          label: ({node}) => <div class={'flex items-center'}>
            <FolderIcon/>
            <div class={'ml-8px'}>{node.label}</div>
          </div>
        }}
      </Tree>,
      confirmBtn: '移动',
      placement: 'center',
      className: 'todo-item-article',
      width: '600px',
      closeOnOverlayClick: false,
      closeBtn: false,
      onConfirm() {
        const id = selectedKeys.value[0];
        if (id) {
          const folder = useFolderStore().folderMap.get(id);
          if (folder) {
            resolve(folder);
          }
        } else {
          resolve({
            id,
            name: '',
            pid: 0,
            createTime: new Date(),
            updateTime: new Date()
          });
        }
        p.destroy();
      }
    })
  })
}
