import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import Constant from "@/global/Constant";
import {template} from "radash";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Drawer, Spin, Typography} from "@arco-design/web-vue";

export const codeRunSetting = useUtoolsDbStorage<Record<string, string>>(LocalNameEnum.SETTING_CODE_RUN, {
  'js': "node ${filePath}",
  'py': "py ${filePath}"
});

function getCodeRunCommand(fileName: string): string | null {
  return codeRunSetting.value[fileName];
}

export function disabledCodeRun(fileName: string) {
  return isEmptyString(getCodeRunCommand(fileName));
}

async function codeRun(fileName: string, content: string) {
  const commandTemplate = getCodeRunCommand(fileName);
  if (isEmptyString(commandTemplate)) {
    return Promise.reject(new Error("代码文件未配置此类型的运行命令"))
  }
  // 保存到临时目录
  const path = window.preload.customer.writeStrToFile(Constant.id, fileName, content, utools.getPath('temp'));
  let command = template(commandTemplate as string, {
    filePath: path
  });
  const result = ref('');
  const complete = ref(false);
  window.preload.util.runCommand(command, {
    onSuccess() {
      MessageUtil.success("执行成功");
      complete.value = true;
    },
    onError(e) {
      MessageUtil.error("执行失败", e);
      complete.value = true;
    },
    onProgress(e) {
      result.value = result.value + e;
    }
  });
  Drawer.open({
    title: `「${fileName}」运行`,
    maskClosable: false,
    content: () => <Typography>
      <pre>{result.value}</pre>
      <div style={{width: '100%', padding: '10px'}}>
        <Spin loading={!complete.value} tip={'正在运行中'}></Spin>
      </div>
    </Typography>
  })
}

