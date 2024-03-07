import {Modal, RequestOption, Upload, UploadRequest} from "@arco-design/web-vue";
import MessageUtil from "@/utils/MessageUtil";

/**
 * 打开文章导入
 */
export function openArticleImport(types: Array<string>): Promise<File> {
    return new Promise((resolve, reject) => {

        function customRequest(request: RequestOption): UploadRequest {
            const file = request.fileItem.file;
            if (!file) {
                MessageUtil.success("文件为空，请重新选择文件")
                return {
                    abort() {}
                }
            }
            resolve(file);
            modalReturn.close();
            return {
                abort() {}
            }
        }

        const modalReturn = Modal.open({
            title: '导入',
            content: () => <div>
                <Upload accept={types.join(',')} showFileList={false} draggable customRequest={customRequest}/>
                <div style={{color: 'var(--color-text-2)', marginTop: '7px'}}>支持{types.join("，")}文件</div>
            </div>,
            footer: false
        });
    });
}
