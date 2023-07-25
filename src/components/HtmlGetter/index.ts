import {HtmlGetterOption} from "@/components/HtmlGetter/HtmlGetterOption";
import axios from "axios";
import RuleRenderTypeEnum from "@/enumeration/RuleRenderTypeEnum";

export default class HtmlGetter {

    private readonly option;

    constructor(option: HtmlGetterOption) {
        this.option = option;
    }

    run(): Promise<string> {
        if (this.option.rule.render === RuleRenderTypeEnum.HTTP) {
            return this.httpRun();
        }else if (this.option.rule.render === RuleRenderTypeEnum.U_BROWSER) {
            return this.uBrowserRun();
        }else {
            return Promise.reject("规则渲染方式未知！");
        }
    }

    async httpRun(): Promise<string> {
        let config = {
            url: this.option.url,
            charset: this.option.rule.charset,
            timeout: this.option.rule.timeout || 5000,
            method: this.option.rule.method,
            headers: this.renderHeaders()
        };
        let response = await axios<string>(config);
        return response.data;
    }

    async uBrowserRun(): Promise<string> {
        const uBrowser = utools.ubrowser;
        if (this.option.rule.userAgent) {
            uBrowser.useragent(this.option.rule.userAgent);
        }
        let rsp = await uBrowser.goto(this.option.url)
            .evaluate(() => {
                return document.getElementsByTagName('body')[0].outerHTML;
            }).run({
                show: false
            })
        return Promise.resolve(rsp[0]);
    }

    private renderHeaders(): Record<string, string> {
        let headers = {} as Record<string, string>;
        try {
            headers = Object.assign(headers, JSON.parse(this.option.rule.headers));
        } catch (_) {
        }
        if (this.option.rule.userAgent) {
            headers['User-Agent'] = this.option.rule.userAgent;
        }
        return headers;
    }
}
