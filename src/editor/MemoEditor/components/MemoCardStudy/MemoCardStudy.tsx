import {Button, DrawerPlugin} from "tdesign-vue-next";
import {CloseIcon, SettingIcon} from "tdesign-icons-vue-next";
import {MemoDataCard, MemoDataCardType} from "@/editor/MemoEditor/types";

export function openMemoCardStudy(cards: Array<MemoDataCard<MemoDataCardType>>) {
  const index = ref(0);
  const onClose = () => dp.destroy?.();
  const dp = DrawerPlugin({
    header: false,
    footer: false,
    attach: '.memo-editor',
    size: '100%',
    default: () => <div class={'memo-card-study pos-absolute top-0 left-0 right-0 bottom-0'}>
      <div
        class={'memo-card-study__header flex justify-between items-center pos-absolute top-8px left-8px right-8px height-32px'}>
        <div class={'left flex items-center'}>
          <Button variant={'text'} theme={'primary'} shape={'square'} onClick={onClose}>{{
            icon: () => <CloseIcon/>
          }}</Button>
          <div class={'ml-8px bold'}>
            <span style={{color: 'var(--td-success-color)'}}>{index.value + 1}</span>
            <span> / </span>
            <span>{cards.length}</span>
          </div>
        </div>
        <div>
          <Button variant={'text'} theme={'primary'} shape={'square'}>{{
            icon: () => <SettingIcon/>
          }}</Button>
        </div>
      </div>
    </div>
  })
}