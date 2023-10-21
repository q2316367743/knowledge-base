import {defineStore} from "pinia";
import Constant from "@/global/Constant";

export const useVipStore = defineStore('vip', {
    state: () => ({
        admin: utools.getUser(),
        isVip: utools.isPurchasedUser()
    }),
    getters: {
        avatar: (state): string => state.admin ? state.admin.avatar : './logo.png',
        nickname: state => state.admin ? state.admin.nickname : '未登录',
        isNotVip: (state) => !state.isVip
    },
    actions: {
        openPayment(callback: () => void) {
            utools.openPurchase({
                goodsId: Constant.goodsId
            }, () => {
                this.isVip = utools.isPurchasedUser();
                callback()
            })
        }
    }
})
