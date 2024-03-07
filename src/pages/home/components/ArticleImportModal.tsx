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
import {docxToHtml, docxToMarkdown, htmlToMarkdown, zipToFiles} from "@/utils/file/ConvertUtil";
import MessageUtil from "@/utils/MessageUtil";
import {useWindowSize} from "@vueuse/core";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

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
                <Button type={'primary'} onClick={() => {
                    modalReturn.close();
                    onImport(files.value, folderId.value).then(() => console.debug("导入完成"));
                }}>导入</Button>
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

async function onImport(files: Array<FileItem>, folderId: number) {
    const loadingReturn = MessageBoxUtil.loading("正在导入...");
    try {
        for (let file of files) {
            try {
                await importOne(file, folderId);
                loadingReturn.append(`${file.name} - 导入完成`);
            }catch (e) {
                loadingReturn.append(`${file.name} - 导入失败: ${e}`, 'error')
            }
        }
    }catch (e) {
        MessageUtil.error("导入失败", e);
    }finally {
        loadingReturn.close();
    }
}

async function importOne(file: FileItem, folderId: number) {
    if (file.type === 'code') {
        const text = await readText(file.file);
        // 直接解析文字
        await importToCode(text, file, folderId);
    } else if (file.type === 'html') {
        // 判断原始类型
        await importToHtml(file, folderId);
    } else if (file.type === 'markdown') {
        await importToMarkdown(file, folderId);
    }else {
        return Promise.reject("文件类型未知")
    }
}

function importToCode(text: string, file: FileItem, folderId: number) {
    return useArticleStore().add(getDefaultArticleIndex({
        type: ArticleTypeEnum.CODE,
        name: file.name,
        folder: folderId
    }), getDefaultArticleBase(), text);
}

async function importToHtml(file: FileItem, folderId: number) {
    let text: string;
    if (file.name.endsWith('html')) {
        text = await readText(file.file);
        // 直接导入
    } else if (file.name.endsWith('docx')) {
        text = await docxToHtml(await file.file.arrayBuffer());
    } else {
        return Promise.reject("系统异常，不支持的文件格式：" + file.name);
    }
    return useArticleStore().add(getDefaultArticleIndex({
        type: ArticleTypeEnum.RICH_TEXT,
        name: file.name,
        folder: folderId
    }), getDefaultArticleBase(), text);
}

async function importToMarkdown(file: FileItem, folderId: number) {
    let text: string;
    if (file.name.endsWith('html')) {
        text = htmlToMarkdown(await readText(file.file));
        // 直接导入
    } else if (file.name.endsWith('docx')) {
        text = await docxToMarkdown(await file.file.arrayBuffer());
    } else if (file.name.endsWith('md')) {
        text = await readText(file.file);
    } else if (file.name.endsWith('markdown')) {
        text = await readText(file.file);
    } else {
        return Promise.reject("系统异常，不支持的文件格式：" + file.name);
    }
    return useArticleStore().add(getDefaultArticleIndex({
        type: ArticleTypeEnum.MARKDOWN,
        name: file.name,
        folder: folderId
    }), getDefaultArticleBase(), text);
}

function readText(file: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = function () {
            const text = fileReader.result as string;
            resolve(text);
        }
        fileReader.onerror = function (e) {
            reject(e);
        }
        fileReader.readAsText(file);
    });
}
