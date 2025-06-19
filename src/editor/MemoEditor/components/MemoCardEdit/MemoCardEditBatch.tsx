import {
  MemoDataCard,
  MemoDataCardStatusEnum,
  MemoDataCardType,
  memoDataCardTypeOptions
} from "@/editor/MemoEditor/types";
import {
  Button,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  InputNumber,
  RadioGroup,
  RequestMethodResponse,
  Space,
  Textarea,
  Upload,
  UploadFile
} from "tdesign-vue-next";
import {traverseNumber} from "@/utils/lang/ArrayUtil";
import {useSnowflake} from "@/hooks/Snowflake";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import MessageUtil from "@/utils/modal/MessageUtil";

const placeholderMap: Record<MemoDataCardType, (split: string, nextItem: number) => string> = {
  TEXT: (s, n) => `问题${s}答案${s}解析${traverseNumber(n, "\n").join("")}问题${s}答案${s}解析`,
  CHOICE: (s, n) => `问题${s}选项1${s}选项2${s}选项3${s}答案${traverseNumber(n, "\n").join("")}问题${s}选项1${s}选项2${s}选项3${s}答案\n\n\n注意：答案只能是一个数字`,
  BLANK: (_s, n) => `答案${traverseNumber(n, "\n").join("")}答案`,
  WORD: (s, n) => `单词${s}释义${traverseNumber(n, "\n").join("")}单词${s}释义`,
  IMAGE: (_s, _n) => ''
}

function renderBatchText(content: string, split: string, n: number): Array<MemoDataCard<'TEXT'>> {
  const lines = content.split(traverseNumber(n, "\n").join(""));
  const createAt = Date.now();
  const createDate = toDateTimeString(createAt, "YYYY-MM-DD")
  return lines.map(line => {
    const items = line.split(split);
    return {
      id: useSnowflake().nextId(),
      type: 'TEXT',
      status: MemoDataCardStatusEnum.UNKNOWN,
      createAt,
      createDate,
      lastLearnedAt: 0,
      bgColor: '',
      star: false,
      data: {
        question: items[0],
        answer: items[1],
        analysis: items[2]
      }
    }
  });
}

function renderBatchChoice(content: string, split: string, n: number): Array<MemoDataCard<'CHOICE'>> {
  const lines = content.split(traverseNumber(n, "\n").join(""));
  const createAt = Date.now();
  const createDate = toDateTimeString(createAt, "YYYY-MM-DD")
  return lines.map(line => {
    const items = line.split(split);
    const options = new Array<{ label: string, value: boolean }>();
    if (items.length > 3) {
      const answer = parseInt(items[items.length - 1]);
      items.slice(1, items.length - (Number.isNaN(answer) ? 1 : 2)).forEach((label, index) => options.push({
        label,
        value: answer === index
      }))
    } else if (items.length === 2) {
      items.slice(1).forEach(label => options.push({label, value: false}))
    }
    return {
      id: useSnowflake().nextId(),
      type: 'CHOICE',
      status: MemoDataCardStatusEnum.UNKNOWN,
      createAt,
      createDate,
      lastLearnedAt: 0,
      bgColor: '',
      star: false,
      data: {
        question: items[0] || '',
        options,
        analysis: ''
      }
    }
  });

}

function renderBatchBlank(content: string, split: string, n: number): Array<MemoDataCard<'BLANK'>> {
  const lines = content.split(traverseNumber(n, "\n").join(""));
  const createAt = Date.now();
  const createDate = toDateTimeString(createAt, "YYYY-MM-DD")
  return lines.map(line => {
    return {
      id: useSnowflake().nextId(),
      type: 'BLANK',
      status: MemoDataCardStatusEnum.UNKNOWN,
      createAt,
      createDate,
      lastLearnedAt: 0,
      bgColor: '',
      star: false,
      data: {
        answer: line
      }
    }
  });
}

function renderBatchWord(content: string, split: string, n: number): Array<MemoDataCard<'WORD'>> {
  const lines = content.split(traverseNumber(n, "\n").join(""));
  const createAt = Date.now();
  const createDate = toDateTimeString(createAt, "YYYY-MM-DD")
  return lines.map(line => {
    const items = line.split(split);
    return {
      id: useSnowflake().nextId(),
      type: 'WORD',
      status: MemoDataCardStatusEnum.UNKNOWN,
      createAt,
      createDate,
      lastLearnedAt: 0,
      bgColor: '',
      star: false,
      data: {
        word: items[0],
        examples: [],
        meaning: items.length > 1 ? items.slice(1).map(meaning => ({partOfSpeech: '', translation: meaning})) : []
      }
    }
  });
}

async function renderBatchImage(files: Array<UploadFile>): Promise<Array<MemoDataCard<'IMAGE'>>> {
  const items = new Array<MemoDataCard<'IMAGE'>>();
  const createAt = Date.now();
  const createDate = toDateTimeString(createAt, "YYYY-MM-DD")
  // 上传文件
  for (let file of files) {
    if (!file.raw) continue;
    try {
      const {url} = await useAttachmentUpload.upload(file.raw, file.raw.name, file.raw.type);
      items.push({
        id: useSnowflake().nextId(),
        type: 'IMAGE',
        status: MemoDataCardStatusEnum.UNKNOWN,
        createAt,
        createDate,
        lastLearnedAt: 0,
        bgColor: '',
        star: false,
        data: {
          url, analysis: ''
        }
      })
    } catch (e) {
      MessageUtil.warning(`上传文件「${file.raw.name}」错误`, e);
    }
  }
  return items;
}

/**
 * 打开批量新增卡片
 */
export async function openMemoCardEditBatch(): Promise<Array<MemoDataCard<MemoDataCardType>>> {
  const data = ref({
    // 卡片类型
    type: 'TEXT' as MemoDataCardType,
    // 分隔符
    split: '|',
    // 空几格
    nextItem: 1,
    content: ''
  });
  const files = ref(new Array<UploadFile>());
  const placeholder = computed(() => {
    const func = placeholderMap[data.value.type];
    if (func) return func(data.value.split, data.value.nextItem);
    return '';
  });
  const customerRequest = async (_files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
    return {
      status: 'success',
      response: {}
    }
  }

  return new Promise<Array<MemoDataCard<MemoDataCardType>>>(resolve => {

    const handleSubmit = () => {
      (async () => {
        switch (data.value.type) {
          case 'TEXT':
            return renderBatchText(data.value.content, data.value.split, data.value.nextItem);
          case 'CHOICE':
            return renderBatchChoice(data.value.content, data.value.split, data.value.nextItem);
          case 'BLANK':
            return renderBatchBlank(data.value.content, data.value.split, data.value.nextItem);
          case 'WORD':
            return renderBatchWord(data.value.content, data.value.split, data.value.nextItem);
          case 'IMAGE':
            return await renderBatchImage(files.value);
        }
      })().then(cards => {
        resolve(cards);
        dp.destroy();
      }).catch(e => MessageUtil.error("批量制卡失败", e));
    }

    const dp = DialogPlugin({
      header: '批量制卡',
      placement: "center",
      width: '700px',
      footer: false,
      closeOnOverlayClick: false,
      default: () => <Form data={data.value} class={'w-full h-full'}>
        <FormItem labelAlign={'top'}>
          <RadioGroup v-model={data.value.type} options={memoDataCardTypeOptions}/>
        </FormItem>
        {data.value.type === 'IMAGE' ?
          <Upload v-model={[files.value, 'files']} theme={'file-flow'} placeholder={'支持批量上传文件，文件格式不限'}
                  showThumbnail={true}
                  class={'mb-16px'} requestMethod={customerRequest} multiple={true}
                  abridgeName={[10, 7]}/> : <FormItem labelAlign={'top'}>
            <Textarea v-model={data.value.content} autosize={{minRows: 12, maxRows: 14}}
                      placeholder={placeholder.value}/>
          </FormItem>}
        <div class={'flex items-center justify-between w-full mb-16px'}>
          {data.value.type === 'IMAGE' ? <span></span> : <div class={'flex items-center'}>
            <span class={'mr-2'}>分隔符</span>
            <Input v-model={data.value.split} placeholder={'|'} class={'w-120px'}/>
            <span class={'ml-16px mr-2'}>空几格</span>
            <InputNumber v-model={data.value.nextItem} min={1}/>
          </div>}
          <Button theme={'primary'} onClick={handleSubmit}>批量制卡</Button>
        </div>
        <FormItem label={'导入文件'} labelAlign={'top'}>
          <div class={'flex justify-between items-center'}>
            <Button theme={'primary'} disabled={true}>Anki</Button>
            <Button theme={'primary'} disabled={true}>Excel</Button>
            <Button theme={'primary'} disabled={true}>微信读书</Button>
            <Button theme={'primary'} disabled={true}>脑图OPML</Button>
            <Button theme={'primary'} disabled={true}>大纲笔记OPML</Button>
          </div>
        </FormItem>
      </Form>
    })
  })
}