import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import Constant from "@/global/Constant";
import {template} from "radash";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Button, Drawer, Space, Spin, Typography} from "@arco-design/web-vue";
import {extname} from "@/utils/file/FileUtil";
import {useSnowflake} from "@/hooks/Snowflake";
import {IconStop} from "@arco-design/web-vue/es/icon";

export const codeRunSetting = useUtoolsDbStorage<Record<string, string>>(LocalNameEnum.SETTING_CODE_RUN, {
  'js': "node {{filePath}}",
  'py': "python {{filePath}}"
});

function getCodeRunCommand(fileName: string): string | null {
  for (let key in codeRunSetting.value) {
    if (new RegExp(key).test(fileName)) {
      return codeRunSetting.value[key];
    }
  }
  return null;
}

export function disabledCodeRun(fileName: string) {
  return isEmptyString(getCodeRunCommand(fileName));
}

export async function codeRun(fileName: string, content: string) {
  const commandTemplate = getCodeRunCommand(fileName);
  if (isEmptyString(commandTemplate)) {
    return Promise.reject(new Error("代码文件未配置此类型的运行命令"))
  }
  const ext = extname(fileName);
  const name = `${useSnowflake().nextId()}${ext ? '.' + ext : ''}`;
  // 保存到临时目录
  const {filePath, folder} = await window.preload.customer.writeStrToFile(
    Constant.id, name, content, utools.getPath('temp'));
  let command = template(commandTemplate as string, {filePath, fileDir: folder, fileName: name});
  const result = ref('');
  const loading = ref(true);
  const {abort} = window.preload.util.runCommand(command, {
    onSuccess() {
      MessageUtil.success("执行成功");
      loading.value = false;
    },
    onError(e) {
      MessageUtil.error("执行失败", e);
      loading.value = false;
    },
    onProgress(e) {
      result.value = result.value + e;
    }
  });

  function onAbort() {
    try {
      abort()
    } catch (e) {
      console.error('onAbort', e)
    }
  }

  Drawer.open({
    title: () => <Space>
      <Button type={'outline'} status={'danger'} onClick={onAbort} disabled={!loading.value}>{{
        icon: () => <IconStop/>,
        default: () => "停止"
      }}</Button>
      <div>「`{fileName}」</div>
      <div>{loading.value ? '正在运行中...' : '运行完成'}</div>
    </Space>,
    maskClosable: false,
    placement: 'bottom',
    height: '60vh',
    footer: false,
    content: () => <Typography style={{width: '100%'}}>
      <pre>{result.value}</pre>
      {loading.value && <div style={{width: '100%', padding: '10px'}}>
        <Spin loading={loading.value} tip={'正在运行中'} style={{width: '100%'}}></Spin>
      </div>}
    </Typography>
  })
}

