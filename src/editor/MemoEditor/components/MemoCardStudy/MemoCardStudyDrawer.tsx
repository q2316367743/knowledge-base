import {Button, DrawerPlugin} from "tdesign-vue-next";
import {CloseIcon, SettingIcon} from "tdesign-icons-vue-next";
import {IMemoInstance, MemoDataCard, MemoDataCardStatusEnum, MemoDataCardType} from "@/editor/MemoEditor/types";
import './MemoCardStudyDrawer.less';
import MemoCardStudy from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudy.vue";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openMemoCardStudy(cards: Array<MemoDataCard<MemoDataCardType>>, instance: IMemoInstance) {
  const data = ref(Array.from(cards));
  const index = ref(0);
  const current = computed(() => data.value[index.value]);


  const nextCard = () => {
    if (index.value >= data.value.length - 1) {
      // 完成了，关闭弹窗，显示成功
      dp.destroy?.();
      // 显示成功
      MessageUtil.success("恭喜你，学习完成了")

    }
    index.value++;
  }

  const onRemember = () => {
    if (!current.value) return;
    if (current.value.status < MemoDataCardStatusEnum.COMPLETED) {
      instance.study(current.value.id, MemoDataCardStatusEnum.COMPLETED);
    }
    nextCard();
  }

  const onNotRemember = () => {
    if (!current.value) return;
    if (current.value.status > MemoDataCardStatusEnum.UNKNOWN) {
      instance.study(current.value.id, current.value.status - 1);
    }
    nextCard();
  }
  const onClose = () => dp.destroy?.();
  const dp = DrawerPlugin({
    header: false,
    footer: false,
    attach: '.memo-editor',
    size: '100%',
    drawerClassName: 'no-padding',
    default: () => <div class={'memo-card-study'}>
      <div
        class={'memo-card-study__header'}>
        <div class={'left'}>
          <Button variant={'text'} theme={'primary'} shape={'square'} onClick={onClose}>{{
            icon: () => <CloseIcon/>
          }}</Button>
          <div class={'page'}>
            <span class={'index'}>{index.value + 1}</span>
            <span> / </span>
            <span>{data.value.length}</span>
          </div>
        </div>
        <div>
          <Button variant={'text'} theme={'primary'} shape={'square'}>{{
            icon: () => <SettingIcon/>
          }}</Button>
        </div>
      </div>
      <div class={'memo-card-study__content'}>
        <MemoCardStudy card={data.value[index.value]}></MemoCardStudy>
      </div>
      <div class={'memo-card-study__footer'}>
        <div class={'btn error'} onClick={onNotRemember}>不记得</div>
        <div class={'btn success'} onClick={onRemember}>记住了</div>
      </div>
    </div>
  })
}