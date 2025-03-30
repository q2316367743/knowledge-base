import {
  Radio,
  RadioGroup
} from "@arco-design/web-vue";
import {
  Input,
  InputGroup,
  DialogPlugin
} from 'tdesign-vue-next';
import './index.css';
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";

export interface ExportItem {
  key: number;
  name: string;
  desc: string;
}

export interface ExportResult {
  title: string;
  type: number;
}


export function createArticleExport(id: number, exportItems: Array<ExportItem>): Promise<ExportResult> {
  const articleIndex = useArticleStore().articleMap.get(id);
  const titleWrap = ref(articleIndex ? articleIndex.name : '');
  const type = ref(1);
  return new Promise(resolve => {
    const plugin = DialogPlugin({
      header: '导出',
      placement: 'center',
      draggable: true,
      width: 600,
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
      default: () => <div>
        <InputGroup class={'mb-7px items-center'}>
          <span style="width: 160px">导出文件名称：</span>
          <Input v-model={titleWrap.value} allowClear/>
        </InputGroup>
        <br/>
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
