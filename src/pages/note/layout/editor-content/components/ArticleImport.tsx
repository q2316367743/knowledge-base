import {RequestOption, Upload, UploadRequest} from "@arco-design/web-vue";
import {DialogPlugin} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import {JSX} from "vue/jsx-runtime";

/**
 * 打开笔记导入
 */
export function openArticleImport(types: Array<string>, extra?: () => JSX.Element): Promise<File> {
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
      resolve(file);
      modalReturn.destroy();
      return {
        abort() {
        }
      }
    }

    const modalReturn = DialogPlugin({
      header: '导入',
      placement: 'center',
      default: () => <div class={'w-full overflow-hidden'}>
        {extra ? extra() : ''}
        <Upload accept={types ? types.join(',') : ''} showFileList={false} draggable customRequest={customRequest}/>
        <div
          style={{color: 'var(--td-text-color-secondary)', marginTop: '7px'}}>支持{types ? types.join("，") : '任意类型'}文件
        </div>
      </div>,
      footer: false
    });
  });
}
