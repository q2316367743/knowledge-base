import Handsontable from "handsontable";
import {onUnmounted, ref} from "vue";
import {useArticleImportEvent} from "@/store/components/HomeEditorStore";
import {
    Alert,
    Drawer,
    Link,
    RequestOption,
    Space,
    Textarea,
    Upload,
    UploadRequest
} from "@arco-design/web-vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isObject} from "radash";

function openImportModal(): Promise<string> {

    const types = ['.json']
    const data = ref('');

    function jumpToExcelToJson() {
        utools.redirect(['Excel转Json', 'Excel2Json'], '');
    }

    return new Promise(resolve => {

        function customRequest(request: RequestOption): UploadRequest {
            const file = request.fileItem.file;
            if (!file) {
                MessageUtil.success("文件为空，请重新选择文件")
                return {
                    abort() {
                    }
                }
            }
            const fileReader = new FileReader();
            fileReader.onload = () => {
                data.value = fileReader.result as string || '';
            }

            fileReader.readAsText(file);
            return {
                abort() {
                }
            }
        }

        Drawer.open({
            title: '导入',
            content: () => <Space direction="vertical">
                <Alert>请前往插件【<Link onClick={jumpToExcelToJson}>Excel转Json</Link>】，将Excel转为json后，点击上传或写入。</Alert>
                <Alert>仅支持单个sheet，请不要一次性传入多个sheet；传入多个sheet，只会导入第一个sheet。</Alert>
                <Textarea placeholder="形如[{id: '1'}]这样的对象数组，或者{'sheet': [{id: '1'}]}这样带sheet的对象" v-model={data.value}
                          autoSize={{minRows: 3, maxRows: 9}}/>
                <Upload accept={types.join(',')} showFileList={false}
                        customRequest={customRequest}/>
                <div
                    style={{color: 'var(--color-text-2)', marginTop: '7px'}}>支持{types ? types.join("，") : '任意类型'}文件
                </div>
            </Space>,
            okText: '导入',
            width: 530,
            onOk() {
                resolve(data.value);
            }
        });
    });
}


export function useHandsontableImport(articleId: number, success: (records: Array<Array<string>>, columns: Array<Handsontable.ColumnSettings>) => void) {

    function onImport(id: number) {
        if (id !== articleId) {
            return;
        }
        openImportModal().then(data => {
            // 解析json
            try {
                const records = new Array<Array<string>>()
                let items = JSON.parse(data) as Array<Record<string, any>>;
                if (!Array.isArray(items)) {
                    if (isObject(items)) {
                        let keys = Object.keys(items);
                        if (keys.length === 0) {
                            MessageUtil.error("JSON对象是个空对象");
                            return;
                        }
                        items = (items as Record<string, any>)[keys[0]];
                        MessageUtil.warning("检测到传入了多个sheet，只会导入sheet：" + keys[0]);
                    }else {
                        MessageUtil.error("JSON字符串不是一个数组，请勿上传多个sheet。");
                        return;
                    }
                }
                const first = items[0];
                if (!first) {
                    MessageUtil.error("至少要有一条数据");
                    return;
                }
                // 生成表头
                if (typeof first !== 'object') {
                    MessageUtil.error("JSON数组中第一项不是对象");
                    return;
                }
                const columns: Array<Handsontable.ColumnSettings> = Object.keys(first).map(key => ({
                    title: key,
                    type: 'text'
                }));
                // 实际数据
                for (let item of items) {
                    records.push(columns.map(column => `${item[column.title || '']}`));
                }
                // 最终结果
                success(records, columns);
            } catch (e) {
                MessageUtil.error("JSON解析失败", e);
            }
        });
    }

    useArticleImportEvent.off(onImport);
    useArticleImportEvent.on(onImport);

    onUnmounted(() => {
        useArticleImportEvent.off(onImport);
    })

    return {onImport}
}
