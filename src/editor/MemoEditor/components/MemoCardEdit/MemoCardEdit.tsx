import {
  buildMemoDataCard,
  MemoDataCard, MemoDataCardBlank,
  MemoDataCardChoice, MemoDataCardImage,
  MemoDataCardText,
  MemoDataCardType, MemoDataCardWord
} from "@/editor/MemoEditor/types";
import {DrawerPlugin, Form} from "tdesign-vue-next";
import {clone} from "radash";
import MemoCardEditForText from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEditForText.vue";
import MemoCardEditForChoice from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEditForChoice.vue";
import MemoCardEditForBlank from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEditForBlank.vue";
import MemoCardEditForWord from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEditForWord.vue";
import {deepClone} from "@/utils/lang/FieldUtil";
import MemoCardEditForImage from "@/editor/MemoEditor/components/MemoCardEdit/MemoCardEditForImage.vue";

export function openMemoCardEdit(type: MemoDataCardType, old?: MemoDataCard<MemoDataCardType>): Promise<MemoDataCard<MemoDataCardType>> {
  return new Promise<MemoDataCard<MemoDataCardType>>(resolve => {
    const data = ref<MemoDataCard<MemoDataCardType>>(old ? deepClone(old) : buildMemoDataCard(type, {}));
    const op = !!old ? '修改' : '新增';
    const dp = DrawerPlugin({
      header: op + '卡片',
      placement: 'right',
      size: '751px',
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      closeBtn: true,
      default: () => <Form data={data.value}>
        {data.value.type === 'TEXT' ? <MemoCardEditForText v-model={data.value.data as MemoDataCardText}/> :
          data.value.type === 'BLANK' ? <MemoCardEditForBlank v-model={data.value.data as MemoDataCardBlank}/> :
            data.value.type === 'CHOICE' ? <MemoCardEditForChoice v-model={data.value.data as MemoDataCardChoice}/> :
              data.value.type === 'WORD' ? <MemoCardEditForWord v-model={data.value.data as MemoDataCardWord}/> :
                data.value.type === 'IMAGE' ? <MemoCardEditForImage v-model={data.value.data as MemoDataCardImage}/> :
                <div>卡片类型错误</div>}
      </Form>,
      confirmBtn: op,
      onConfirm: () => {
        resolve(data.value)
        dp.destroy?.();
      }
    })
  })
}