import Handsontable from "handsontable";
import {
  Alert,
  DrawerPlugin,
  Link,
  Space,
  Textarea,
  Upload, UploadProps,
} from "tdesign-vue-next";
import {useArticleImportEvent} from "@/store/components/HomeEditorStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isObject} from "radash";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useMountEventBus} from "@/hooks/MountEventBus";

function openImportModal(): Promise<string> {

  const types = ['.json']
  const data = ref('');

  function jumpToExcelToJson() {
    InjectionUtil.redirect(['Excel转Json', 'Excel2Json'], '');
  }

  return new Promise(resolve => {

    const customRequest: UploadProps['requestMethod'] = async (file) => {
      if (!file) {
        MessageUtil.success("文件为空，请重新选择文件")
        return {
          status: 'fail',
          error: '文件为空，请重新选择文件',
          response: {}
        }
      }
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          data.value = fileReader.result as string || '';
          resolve({
            status: 'success',
            response: {}
          });
        }
        fileReader.onerror = reject;
        fileReader.readAsText((Array.isArray(file) ? file[0] : file).raw!);
      })
    }

    const dp = DrawerPlugin({
      header: '导入',
      default: () => <Space direction="vertical">
        <Alert>请前往插件【<Link
          onClick={jumpToExcelToJson}>Excel转Json</Link>】，将Excel转为json后，点击上传或写入。</Alert>
        <Alert>仅支持单个sheet，请不要一次性传入多个sheet；传入多个sheet，只会导入第一个sheet。</Alert>
        <Textarea placeholder="形如[{id: '1'}]这样的对象数组，或者{'sheet': [{id: '1'}]}这样带sheet的对象"
                  v-model={data.value}
                  autosize={{minRows: 3, maxRows: 9}}/>
        <Upload accept={types.join(',')}
                requestMethod={customRequest}/>
        <div
          style={{color: 'var(--td-text-color-secondary)', marginTop: '7px'}}>支持{types ? types.join("，") : '任意类型'}文件
        </div>
      </Space>,
      confirmBtn: '导入',
      size: '530px',
      onConfirm() {
        resolve(data.value);
        dp.destroy?.();
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
          } else {
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

  useMountEventBus(useArticleImportEvent, onImport)

}
