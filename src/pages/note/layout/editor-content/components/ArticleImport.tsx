import {Upload} from 'tdesign-vue-next';
import {DialogPlugin} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import {JSX} from "vue/jsx-runtime";
import {RequestMethodResponse, UploadFile} from "tdesign-vue-next/es/upload/type";

/**
 * 打开笔记导入
 */
export function openArticleImport(types: Array<string>, extra?: () => JSX.Element): Promise<File> {
  return new Promise(resolve => {

    const customRequest =async (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
      const file = Array.isArray(files) ? files[0] : files;
      if (!file || !file.raw) {
        MessageUtil.success("文件为空，请重新选择文件")
        return {
          status: 'fail',
          error: '文件为空，请重新选择文件',
          response: {}
        }
      }
      resolve(file.raw);
      modalReturn.destroy();
      return {
        status: 'success',
        response: {}
      }
    }

    const modalReturn = DialogPlugin({
      header: '导入',
      placement: 'center',
      width: '402px',
      default: () => <div class={'w-full overflow-hidden'}>
        {extra ? extra() : ''}
        <Upload accept={types ? types.join(',') : ''} draggable requestMethod={customRequest} class={'w-full'}/>
        <div
          style={{color: 'var(--td-text-color-secondary)', marginTop: '7px'}}>支持{types ? types.join("，") : '任意类型'}文件
        </div>
      </div>,
      footer: false
    });
  });
}
