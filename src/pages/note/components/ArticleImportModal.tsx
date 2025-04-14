import {useUmami} from "@/plugin/umami";
import {Drawer} from "@arco-design/web-vue";
import {
  Alert,
  Button,
  List,
  ListItem,
  Space,
  TreeSelect
} from 'tdesign-vue-next';
import {DeleteIcon} from "tdesign-icons-vue-next";
import {useFolderStore} from "@/store";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {zipToFiles} from "@/utils/file/ConvertUtil";
import {readAsText} from "@/utils/file/FileUtil";
import {group} from '@/utils/lang/ArrayUtil';
import {addNote} from "@/utils/component/AddNoteUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

type OptionItemType = 'markdown' | 'code';

interface FileItem {
  file: File;
  name: string;
  type: OptionItemType;
}


export function showArticleImportModal(id: number) {
  const size = useWindowSize();

  const files = ref<Array<FileItem>>([]);
  const folderId = ref(id);
  const zipLoading = ref(false);

  const folderTree = useFolderStore().folderTree;

  const height = computed(() => size.height.value - 65 - 48 - 24 - 165 - 7 - (zipLoading.value ? 47 : 0));

  const customRequest = async (file: File) => {
    if (file.name.endsWith('zip')) {
      try {
        zipLoading.value = true;
        const items = await zipToFiles(file);
        items.forEach(f => {
          files.value.push(renderFileItem(f))
        });
      } finally {
        zipLoading.value = false;
      }
    } else {
      files.value.push(renderFileItem(file))
    }
  }

  function removeFile(index: number) {
    files.value.splice(index, 1);
  }

  // 处理文件拖拽和选择
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);

  // 处理点击上传区域
  const handleClickUpload = () => {
    fileInputRef.value?.click();
  };

  // 处理文件选择
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      Array.from(target.files).forEach(file => {
        customRequest(file);
      });
      // 清空input，以便于下次选择同一文件时也能触发change事件
      target.value = '';
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = true;
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = false;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = false;

    if (e.dataTransfer?.files) {
      Array.from(e.dataTransfer.files).forEach(file => {
        customRequest(file);
      });
    }
  };

  const modalReturn = Drawer.open({
    title: () => <div>笔记导入<span style={{fontSize: '0.8rem'}}>（仅支持markdown、富文本和代码笔记）</span></div>,
    width: 600,
    content: () => <div>
      <div
        class="upload-area"
        style={{
          border: '1px dashed var(--td-component-stroke)',
          borderRadius: '3px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging.value ? 'var(--td-bg-color-container-hover)' : 'var(--td-bg-color-container)',
          transition: 'background-color 0.3s'
        }}
        onClick={handleClickUpload}
        onDragover={handleDragOver}
        onDragleave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{display: 'none'}}
          onChange={handleFileChange}
        />
        <div style={{marginBottom: '8px'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19Z"
                  fill="var(--td-text-color-secondary)"/>
            <path d="M11 11.5V17H13V11.5H16L12 7.5L8 11.5H11Z" fill="var(--td-text-color-secondary)"/>
          </svg>
        </div>
        <div style={{color: 'var(--td-text-color-secondary)'}}>
          点击或拖拽文件到此区域上传
        </div>
        <div style={{color: 'var(--td-text-color-placeholder)', fontSize: '12px', marginTop: '4px'}}>
          支持所有文件类型，支持批量上传
        </div>
      </div>
      {zipLoading.value && <Alert style={{marginTop: '7px'}}>压缩包解析中</Alert>}
      {files.value.length > 0 &&
        <List style={{marginTop: '7px', maxHeight: height.value}}>
          {files.value.map((file, index) => <ListItem>
            {{
              default: () => <div>{file.name}</div>,
              actions: () => <Button variant={'text'} theme={'danger'} shape={'square'}
                                     onClick={() => removeFile(index)}>{{
                icon: () => <DeleteIcon/>
              }}</Button>
            }}
          </ListItem>)}
        </List>}
    </div>,
    footer: () => <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div class={'flex items-center'}>
        <span style={{width: '120px', marginRight: '7px', color: 'var(--td-text-color-primary)'}}>导入至：</span>
        <TreeSelect data={folderTree} v-model={folderId.value}/>
      </div>
      <Space>
        <Button onClick={modalReturn.close}>取消</Button>
        <Button theme={'primary'} onClick={() => {
          modalReturn.close();
          onImport(files.value, folderId.value).then(() => console.debug("导入完成"));
        }}>导入</Button>
      </Space>
    </div>,
  })
}

function renderFileItem(file: File): FileItem {
  return {file, name: file.name, type: getDefaultOption(file.name)};
}

function getDefaultOption(name: string): OptionItemType {
  if (name.endsWith('md') || name.endsWith('markdown')) {
    return 'markdown';
  }
  return 'code';
}

async function onImport(files: Array<FileItem>, folderId: number) {
  useUmami.track("导入数据")
  const loadingReturn = MessageBoxUtil.loading("正在导入...");
  const count = files.length + '';
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await importOne(file, folderId);
        loadingReturn.append(`${(i + 1 + '').padStart(count.length, '0')} / ${count}: ${file.name} - 导入完成`);
      } catch (e) {
        loadingReturn.append(`${(i + 1 + '').padStart(count.length, '0')} / ${count}: ${file.name} - 导入失败: ${e}`, 'error')
      }
    }
  } catch (e) {
    MessageUtil.error("导入失败", e);
  } finally {
    setTimeout(() => loadingReturn.close(), 2000);
  }
}

async function importOne(file: FileItem, folderId: number) {
  if (file.type === 'code') {
    const text = await readAsText(file.file);
    // 直接解析文字
    await importToCode(text, file, folderId);
  } else if (file.type === 'markdown') {
    await importToMarkdown(file, folderId);
  } else {
    return Promise.reject("文件类型未知")
  }
}

// 导入到文件夹
async function importToFolder(file: FileItem, folderId: number): Promise<{ folder: number, fileName: string }> {
  const {folders, addFolder} = useFolderStore();
  const folderGroupMap = group(folders, 'pid');
  let paths = file.name.split(/[\\/]/);
  let fileName = paths.pop() || file.name;
  for (let path of paths) {
    if (!path) {
      continue;
    }
    const children = folderGroupMap.get(folderId);
    if (children) {
      const child = children.find(f => f.name === path);
      if (child) {
        folderId = child.id;
      } else {
        // 创建子文件夹
        const newFolder = await addFolder(folderId, path);
        folderId = newFolder.id;
      }
    } else {
      // 创建子文件夹，挂载到当前目录下
      const newFolder = await addFolder(folderId, path);
      folderId = newFolder.id;
    }
  }
  return {folder: folderId, fileName};
}

async function importToCode(text: string, file: FileItem, folderId: number) {
  const {folder, fileName} = await importToFolder(file, folderId);
  return addNote({
    type: ArticleTypeEnum.CODE,
    name: fileName,
    pid: folder,
    content: text
  });
}

async function importToMarkdown(file: FileItem, folderId: number) {
  let text = await readAsText(file.file);
  const {folder, fileName} = await importToFolder(file, folderId);
  return addNote({
    type: ArticleTypeEnum.MARKDOWN,
    name: fileName.replace(/\.md|\.markdown/, ''),
    pid: folder,
    content: text
  });
}
