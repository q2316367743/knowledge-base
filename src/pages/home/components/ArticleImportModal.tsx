import {
    Alert,
    Button,
    Drawer,
    InputGroup,
    List,
    ListItem,
    Option,
    RequestOption,
    Select,
    Space,
    TreeSelect,
    Upload,
    UploadRequest
} from "@arco-design/web-vue";
import {computed, ref} from "vue";
import {useFolderStore} from "@/store/db/FolderStore";
import {IconDelete} from "@arco-design/web-vue/es/icon";
import {zipToFiles} from "@/utils/file/ConvertUtil";
import MessageUtil from "@/utils/MessageUtil";
import {useWindowSize} from "@vueuse/core";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

interface FileItem {
    file: File;
    name: string;
    type: OptionItemType;
    options: Array<OptionItem>
}

interface OptionItem {
    label: string;
    value: OptionItemType;
}

type OptionItemType = 'markdown' | 'html' | 'code';


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
                            actions: () => <Space>
                                <Select v-model={file.type}>
                                    {file.options.map(option =>
                                        <Option value={option.value} label={option.label}>
                                            {option.label}
                                        </Option>)}
                                </Select>
                                <Button type={'text'} status={'danger'} onClick={() => removeFile(index)}>
                                    {{
                                        icon: () => <IconDelete/>
                                    }}
                                </Button>
                            </Space>
                        }}
                    </ListItem>)}
                </List>}
        </div>,
        footer: () => <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <InputGroup>
                <span style={{width: '70px', marginRight: '7px', color: 'var(--color-text-1)'}}>导入至</span>
                <TreeSelect data={folderTree} v-model={folderId.value}/>
            </InputGroup>
            <Space>
                <Button onClick={modalReturn.close}>取消</Button>
                <Button type={'primary'} onClick={() => onImport(files.value)}>导入</Button>
            </Space>
        </div>,
    })
}

function renderFileItem(file: File): FileItem {
    return {file, name: file.name, type: getDefaultOption(file.name), options: getOptions(file.name)};
}

function getDefaultOption(name: string): OptionItemType {
    if (name.endsWith('md') || name.endsWith('markdown')) {
        return 'markdown';
    } else if (name.endsWith('html')) {
        return 'html'
    } else if (name.endsWith('docx')) {
        return 'html';
    }
    return 'code';
}

function getOptions(name: string): OptionItem[] {
    if (name.endsWith('md') || name.endsWith('markdown')) {
        return [{
            label: 'markdown',
            value: 'markdown'
        }]
    } else if (name.endsWith('docx')) {
        return [{
            label: 'markdown',
            value: 'markdown'
        }, {
            label: '富文本',
            value: 'html'
        }]
    } else if (name.endsWith('html')) {
        return [{
            label: 'markdown',
            value: 'markdown'
        }, {
            label: '富文本',
            value: 'html'
        }]
    }
    return [{
        label: '代码文件',
        value: 'code'
    }]
}

async function onImport(files: Array<FileItem>) {
    for (let file of files) {
        await importOne(file);
    }
}

async function importOne(file: FileItem) {
    const text = await readText(file.file);
    if (file.type === 'code') {
        // 直接解析文字
        await importToCode(text, file);
    }else if (file.type === 'html') {
        // 判断原始类型
    }
}

function importToCode(text: string, file: FileItem) {
    return useArticleStore().add(getDefaultArticleIndex({
        type: ArticleTypeEnum.CODE,
        name: file.name
    }), getDefaultArticleBase(), text);
}

function readText(file: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = function (e) {
            const text = fileReader.result as string;
            resolve(text);
        }
        fileReader.onerror = function (e) {
            reject(e);
        }
        fileReader.readAsText(file);
    });
}
