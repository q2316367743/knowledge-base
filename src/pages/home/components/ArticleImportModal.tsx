import {
    Alert,
    Button,
    Drawer,
    InputGroup,
    List,
    ListItem,
    RequestOption,
    Space,
    TreeSelect,
    Upload,
    UploadRequest
} from "@arco-design/web-vue";
import {computed, ref} from "vue";
import {useFolderStore} from "@/store/db/FolderStore";
import {IconDelete} from "@arco-design/web-vue/es/icon";
import {zipToFiles} from "@/utils/file/ConvertUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useWindowSize} from "@vueuse/core";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {readAsText} from "@/utils/file/FileUtil";
import {access} from "@/plugin/Statistics";
import {group} from '@/utils/lang/ArrayUtil';

interface FileItem {
    file: File;
    name: string;
    type: OptionItemType;
}

type OptionItemType = 'markdown' | 'code';


export function showArticleImportModal(id: number) {
    const size = useWindowSize();

    const files = ref<Array<FileItem>>([]);
    const folderId = ref(id);
    const zipLoading = ref(false);

    const folderTree = useFolderStore().folderTree;

    const height = computed(() => size.height.value - 65 - 48 - 24 - 165 - 7 - (zipLoading.value ? 47 : 0));

    function customRequest(request: RequestOption): UploadRequest {
        const file = request.fileItem.file;
        if (file) {
            if (file.name.endsWith('zip')) {
                zipLoading.value = true;
                zipToFiles(file)
                    .then(items => items.forEach(f => {
                        files.value.push(renderFileItem(f))
                    }))
                    .catch(e => MessageUtil.error("压缩包解析失败", e))
                    .finally(() => zipLoading.value = false);
            } else {
                files.value.push(renderFileItem(file))
            }
        }
        return {
            abort() {
            }
        }
    }

    function removeFile(index: number) {
        files.value.splice(index, 1);
    }

    const modalReturn = Drawer.open({
        title: () => <div>文章导入<span style={{fontSize: '0.8rem'}}>（仅支持markdown、富文本和代码笔记）</span></div>,
        width: 600,
        content: () => <div>
            <Upload draggable multiple showFileList={false} customRequest={customRequest} disabled={zipLoading.value}/>
            {zipLoading.value && <Alert style={{marginTop: '7px'}}>压缩包解析中</Alert>}
            {files.value.length > 0 &&
                <List style={{marginTop: '7px'}} bordered={false} maxHeight={height.value}>
                    {files.value.map((file, index) => <ListItem>
                        {{
                            default: () => <div>{file.name}</div>,
                            actions: () => <Button type={'text'} status={'danger'} onClick={() => removeFile(index)}>{{
                                icon: () => <IconDelete/>
                            }}</Button>
                        }}
                    </ListItem>)}
                </List>}
        </div>,
        footer: () => <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <InputGroup>
                <span style={{width: '120px', marginRight: '7px', color: 'var(--color-text-1)'}}>导入至：</span>
                <TreeSelect data={folderTree} v-model={folderId.value}/>
            </InputGroup>
            <Space>
                <Button onClick={modalReturn.close}>取消</Button>
                <Button type={'primary'} onClick={() => {
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
    access("导入数据")
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
async function importToFolder(file: FileItem, folderId: number): Promise<{folder: number, fileName: string}> {
    const {folders, addFolder} = useFolderStore();
    const folderGroupMap = group(folders, 'pid');
    let paths = file.name.split(/[\\/]/);
    let fileName = paths.pop() || file.name;
    for (let path of paths) {
        if (!path) {
            continue;
        }
        const children  = folderGroupMap.get(folderId);
        if (children) {
            const child = children.find(f => f.name === path);
            if (child) {
                folderId = child.id;
            } else {
                // 创建子文件夹
                const newFolder = await addFolder(folderId, path);
                folderId = newFolder.id;
            }
        }else {
            // 创建子文件夹，挂载到当前目录下
            const newFolder = await addFolder(folderId, path);
            folderId = newFolder.id;
        }
    }
    return {folder: folderId, fileName};
}

async function importToCode(text: string, file: FileItem, folderId: number) {
    const {folder, fileName} = await importToFolder(file, folderId);
    return useArticleStore().add(getDefaultArticleIndex({
        type: ArticleTypeEnum.CODE,
        name: fileName,
        folder
    }), getDefaultArticleBase(), text);
}

async function importToMarkdown(file: FileItem, folderId: number) {
    let text = await readAsText(file.file);
    const {folder, fileName} = await importToFolder(file, folderId);
    return useArticleStore().add(getDefaultArticleIndex({
        type: ArticleTypeEnum.MARKDOWN,
        name: fileName.replace(/\.md|\.markdown/, ''),
        folder
    }), getDefaultArticleBase(), text);
}
