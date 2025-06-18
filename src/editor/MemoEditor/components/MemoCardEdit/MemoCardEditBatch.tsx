import {MemoDataCard, MemoDataCardType, memoDataCardTypeOptions} from "@/editor/MemoEditor/types";
import {DialogPlugin, Form, FormItem, RadioGroup, Textarea} from "tdesign-vue-next";

const placeholderMap: Record<MemoDataCardType, any> = {
  TEXT: '问题|答案\n问题|答案',
  CHOICE: '问题|选项1|选项2|选项3|答案\n问题|选项1|选项2|选项3|答案',
  BLANK: '答案\n答案',
  WORD: '单词|释义\n单词|释义',
  IMAGE: '图片\n图片'
}

type SplitType = '|' | '\t' | ',';

/**
 * TODO: 打开批量新增卡片
 */
export async function openMemoCardEditBatch(): Promise<Array<MemoDataCard<MemoDataCardType>>> {
  const data = ref({
    // 卡片类型
    type: 'TEXT',
    // 分隔符
    split: '|',
    // 空几格
    nextItem: 1,
    content: ''
  });
  const placeholder = computed(() => placeholderMap[data.value.type]);
  return new Promise<Array<MemoDataCard<MemoDataCardType>>>(resolve => {
    const dp = DialogPlugin({
      header: '批量制卡',
      placement: "center",
      width: '700px',
      footer: false,
      default: () => <Form data={data.value} class={'w-full h-full'}>
        <FormItem labelAlign={'top'}>
          <RadioGroup v-model={data.value.type} options={memoDataCardTypeOptions}/>
        </FormItem>
        <FormItem labelAlign={'top'}>
          <Textarea v-model={data.value.content} autosize={{minRows: 8, maxRows: 10}} placeholder={placeholder.value}/>
        </FormItem>
        <FormItem label={'导入文件'} labelAlign={'top'}>
          Anki
        </FormItem>
      </Form>
    })
  })
}