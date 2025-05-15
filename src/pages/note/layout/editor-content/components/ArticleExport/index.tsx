import {
  Radio,
  RadioGroup
} from "@arco-design/web-vue";
import {
  Input,
  DialogPlugin
} from 'tdesign-vue-next';
import './index.css';
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";

export interface ExportItem {
  key: number;
  name: string;
  desc: string;
  extname: string;
}

export interface ExportResult {
  title: string;
  type: number;
}


export function createArticleExport(id: number, exportItems: Array<ExportItem>): Promise<ExportResult> {
  const articleIndex = useArticleStore().articleMap.get(id);
  const titleWrap = ref(articleIndex ? articleIndex.name : '');
  const type = ref(1);
  const extname = computed(() => (`${exportItems.find(e => e.key === type.value)?.extname}`));
  return new Promise(resolve => {
    const plugin = DialogPlugin({
      header: '导出',
      placement: 'center',
      draggable: true,
      width: 624,
      onConfirm() {
        if (titleWrap.value.trim() === '') {
          MessageUtil.warning("请输入文件名");
          return;
        }
        resolve({
          title: titleWrap.value,
          type: type.value
        });
        plugin.destroy();
      },
      default: () => <div class={'mt-8px'}>
        <div class={'pl-5px pr-20px'}>
          <Input v-model={titleWrap.value} label={'文件名称：'} align={'right'} placeholder={'请输入文件名'}>{{
            suffix: () => extname.value ? <div>.{extname.value}</div> : <div></div>
          }}</Input>
        </div>
        <RadioGroup v-model={type.value}>
          {exportItems.map(item => <Radio value={item.key}>
            {{
              radio: (data: { checked: boolean }) => {
                return <div
                  class={data.checked ? 'custom-radio-card custom-radio-card-checked' : 'custom-radio-card'}
                >
                  <div class="custom-radio-card-top">
                    <div class="custom-radio-card-mask">
                      <div class="custom-radio-card-mask-dot"/>
                    </div>
                    <div class="custom-radio-card-title">
                      {item.name}
                    </div>
                  </div>
                  <div class="custom-radio-card-desc">
                    {item.desc}
                  </div>
                </div>
              }
            }}
          </Radio>)}
        </RadioGroup>
      </div>
    })
  })
}
