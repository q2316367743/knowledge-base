import {BlockToolConstructorOptions} from "@editorjs/editorjs";
import {PluginDefine} from "@/components/editor-js/plugins/PluginDefine";
import MessageUtil from "@/utils/MessageUtil";

interface BilibiliVideoData {

    bvid: string;

}

export class BilibiliVideo extends PluginDefine<BilibiliVideoData> {

    private wrapper: HTMLDivElement | null = null;

    constructor(ops: BlockToolConstructorOptions<BilibiliVideoData>) {
        super(ops);
    }

    static get toolbox() {
        return {
            title: '哔哩哔哩视频',
            icon: '<svg t="1697336883481" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4146" width="16" height="16"><path d="M442.37196402 448.86019072l-137.29613938 26.28689351 11.75699683 51.52780174 135.91227848-26.28559986-10.37313593-51.52909539z m74.00616391 136.60226674c-33.54537074 71.93101881-63.63173433 17.6380837-63.63173319 17.63808483l-22.47577373 14.52730824s44.26155805 60.52095886 86.4557386 14.52342499c49.80088718 45.99753387 87.84089429-14.86906709 87.84089429-14.86906709l-20.40580665-13.14215254c0.00129479-0.34693575-35.61922105 51.18086485-67.78331932-18.67759843z m67.78461298-85.07575979L720.42066147 526.67229639l11.41135474-51.5278006-136.94790883-26.28689465-10.72136647 51.52909653z m270.54555363-101.17852274c-2.16835186-95.98612935-85.88743566-114.39316878-85.88743566-114.39316878s-65.31851719-0.35988139-150.12372025-1.08352853l61.71063979-59.54228793s9.74269554-12.27092878-6.85716935-25.98008832c-16.60245333-13.71174912-17.68468707-7.57822691-23.45573945-3.96775993-5.05387691 3.60658375-79.03285589 76.14085803-92.02225266 89.13413803-33.55831523 0-68.56521955-0.36376576-102.48600576-0.36376576h11.90845781s-88.41178567-87.32955193-94.18672128-91.29731072c-5.77493561-3.96905472-6.49599317-9.74010595-23.4570331 3.96775992-16.59986375 13.71304391-6.85716935 25.98138311-6.85716935 25.98138312l63.15146013 61.34816768c-68.56392477 0-127.75021454 0.36376576-155.17371392 1.44341106-88.77555143 25.62409017-81.91708729 114.75563975-81.9170873 114.75563974s1.08093895 191.26155719 0 287.97521579c9.74269554 96.71365973 84.08155477 112.22611171 84.08155592 112.22611172s29.59055531 0.72235235 51.60676807 0.72235235c2.16187904 6.13481699 3.96646514 36.44772466 37.89113571 36.4477258 33.55961003 0 37.88854613-36.44772466 37.88854614-36.4477258s247.19726137-1.08093895 267.76488504-1.08093895c1.08482333 10.4637531 6.13740544 38.2510171 40.05819165 37.89242937 33.55831523-0.72364715 36.08396003-40.0556032 36.08396003-40.0556032s11.54987008-1.08352853 45.83053882 0c80.11508963-14.79786723 84.80390713-108.62211755 84.80390712-108.62211641s-1.43952669-193.06873287-0.35599815-289.06004025zM785.78189881 705.22925511c0 15.15515904-11.90975261 27.42349824-26.70503026 27.42349824H271.9071653c-14.79527765 0-26.70373547-12.2683392-26.70373547-27.42349824V382.24972345c0-15.15774862 11.90975261-27.42738261 26.70373547-27.42738262h487.16970325c14.79527765 0 26.70503026 12.26963399 26.70503026 27.42738262v322.97953166z" fill="#fb7299" p-id="4147"></path></svg>'
        };
    }

    render(): HTMLDivElement {
        this.wrapper = document.createElement('div');
        if (this.data.bvid) {
            // 存在bvid
            this.wrapper.append(this.renderIframe())
        } else {
            // 输入框
            const span = document.createElement('span');
            span.className = 'arco-input-wrapper';
            span.style.width = '320px';
            this.wrapper.append(span);
            const input = document.createElement('input');
            input.className = 'arco-input arco-input-size-medium';
            input.type = 'text';
            input.readOnly = this.readonly;
            input.placeholder = '请输入BV号或者视频详情链接';
            input.addEventListener('change', () => {
                this.data.bvid = input.value;
            });
            span.append(input);
            const button = document.createElement('button');
            button.className = 'arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal';
            button.innerText = '确定'
            button.disabled = this.readonly;
            button.addEventListener('click', () => {

                let bvid = this.data.bvid;
                if (bvid.startsWith('http')) {
                    const a = bvid.indexOf('?');
                    if (a > -1) {
                        bvid = bvid.substring(0, a);
                    }
                    const b = bvid.indexOf('BV');
                    if (b === -1) {
                        MessageUtil.error("未发现BV号");
                        return;
                    }
                    bvid = bvid.substring(b, bvid.length);
                    if (bvid.endsWith('/')) {
                        bvid = bvid.substring(0, bvid.length - 1);
                    }
                } else if (!bvid.startsWith("BV")) {
                    MessageUtil.error("请输入以BV开头的BV号或者以http开头的视频详情链接");
                    return;
                }
                this.data.bvid = bvid;
                // 重新渲染
                if (this.wrapper) {
                    this.wrapper.innerHTML = '';
                    this.wrapper.append(this.renderIframe());
                }
            })
            this.wrapper.append(button);
        }
        return this.wrapper;
    }

    private renderIframe() {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('border', '0');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('framespacing', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.src = '//player.bilibili.com/player.html?bvid=' + this.data.bvid;
        iframe.width = '100%';
        iframe.height = '400px';
        return iframe;

    }


    save(): BilibiliVideoData {
        return this.data
    }
}
