import {Modal, RequestOption, Upload, UploadRequest} from "@arco-design/web-vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {JSX} from "vue/jsx-runtime";

/**
 * 打开笔记导入
 */
export function openArticleImport(types: Array<string>, extra?: () => JSX.Element): Promise<File> {
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
                {extra ? extra() : ''}
                <Upload accept={types ? types.join(',') : ''} showFileList={false} draggable customRequest={customRequest}/>
                <div style={{color: 'var(--color-text-2)', marginTop: '7px'}}>支持{types ? types.join("，") : '任意类型'}文件</div>
            </div>,
            footer: false
        });
    });
}
