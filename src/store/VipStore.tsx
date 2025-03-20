import {defineStore} from "pinia";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";
import {DialogPlugin} from "tdesign-vue-next";

export const useVipStore = defineStore('vip', () => {
  const noteVip = ref(false);
  const todoVip = ref(false);

  async function init() {
    const payments = await utools.fetchUserPayments();
    for (const payment of payments) {
      if (payment.goods_id === Constant.goods.note) {
        noteVip.value = true;
      } else if (payment.goods_id === Constant.goods.note) {
        todoVip.value = true;
      }
    }
  }

  init()
    .then(() => console.debug('vip init success'))
    .catch(e => MessageUtil.error('vip init error', e));

  const noteNoVip = computed(() => !noteVip.value);
  const todoNoVip = computed(() => !todoVip.value);

  async function openVip(type: 'note' | 'todo') {
    const goodsId = type === 'note' ? Constant.goods.note : Constant.goods.todo;
    return new Promise<void>((resolve, reject) => {
      try {
        utools.openPurchase({
          goodsId
        }, () => resolve());
      } catch (e) {
        reject(e);
      }
    })
  }

  return {
    noteNoVip, todoNoVip,
    openVip
  }

});

function noteVip() {
  return () => <div>笔记会员</div>
}

function todoVip() {
  return () => <div>待办会员</div>
}

export async function checkPower(type: 'note' | 'todo') {
  const vipStore = useVipStore();
  let isNoVip = true;
  let header = '';
  if (type === 'note') {
    header = '开通笔记会员';
    isNoVip = vipStore.noteNoVip;
  } else if (type === 'todo') {
    header = '开通待办会员';
    isNoVip = vipStore.todoNoVip;
  }
  // 打开窗口进行提示
  if (!isNoVip) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const instance = DialogPlugin({
      header,
      placement: 'center',
      closeOnOverlayClick: false,
      closeOnEscKeydown: false,
      closeBtn: false,
      confirmBtn: {
        default: '开通'
      },
      default: type === 'note' ? noteVip() : todoVip(),
      onConfirm: () => {
        vipStore.openVip(type).then(() => {
          resolve();
          instance.destroy();
        }).catch(reject);
      },
      onCancel: () => {
        instance.destroy();
        reject(new Error('取消开通会员'));
      }
    });
  })

}