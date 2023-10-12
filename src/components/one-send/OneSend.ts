import {OneSendByJueJin} from "@/components/one-send/impl/OneSendByJueJin";

export interface OneSend {

    /**
     * 一键发送
     * @param id
     */
    send(id: number): void;

}

export enum OneSendType {
    JUEJIN = 1
}

export function getOneSend(type: OneSendType): OneSend {
    let send: OneSend;
    if (type === OneSendType.JUEJIN) {
        return new OneSendByJueJin();
    }else {
        throw new Error("类型错误，无法获取一键发送");
    }
}
