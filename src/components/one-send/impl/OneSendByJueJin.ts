import {OneSend} from "@/components/one-send/OneSend";

export class OneSendByJueJin implements OneSend {

    private readonly HOME: string = "https://juejin.cn";
    private readonly EDITOR: string = "https://juejin.cn/editor/drafts/new?v=2";

    send(id: number): void {
        utools.ubrowser
            .goto(this.HOME)
            .click(".login-button")
            .when(".jj-avatar")
            .end()
            .goto(this.EDITOR)
            .run({
                width: 800,
                height: 600
            }).then(e => console.log("执行成功", e));
    }

}
