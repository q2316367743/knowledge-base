import {MemoDataCard, MemoDataCardType} from "@/editor/MemoEditor/types";
import {DialogPlugin} from "tdesign-vue-next";
import MemoCardPreview from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreview.vue";

export function openMemoCardPreviewModel(card: MemoDataCard<MemoDataCardType>) {
  DialogPlugin({
    header: (card.data as any)['question'] || '',
    footer: false,
    closeBtn: true,
    placement: "center",
    width: '80vw',
    default: () => <div style={{height: 'calc(100vh - 240px)'}}>
      <MemoCardPreview card={card} idx={0} shadow={false}/>
    </div>
  })
}