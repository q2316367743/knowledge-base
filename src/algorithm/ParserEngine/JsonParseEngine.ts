import {ParserEngine} from "@/algorithm/ParserEngine/types";
import {parseRegexToStrings} from "@/algorithm/ParserEngine/util";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {ParserEngineProxy} from "@/algorithm/ParserEngine/ParserEngineProxy";

export class JsonParseEngine implements ParserEngine {

    private readonly json: Record<string, any>;


    constructor(json: string | Record<string, any>) {
        if (typeof json === 'string') {
            this.json = JSON.parse(json);
        } else {
            this.json = json;
        }
    }

    parseToString(select: string): string {
        if (isEmptyString(select)) {
            return '';
        }
        const func = new Function('$', `return ${select}`);
        try {
            return `${func(this.json)}`;
        } catch (e) {
            console.error(e);
            return this.toString();
        }
    }

    parseToEngines(select: string): Array<ParserEngine> {
        const func = new Function('$', `return ${select}`);
        const results = func(this.json);
        if (Array.isArray(results)) {
            return results.map(i => new ParserEngineProxy(new JsonParseEngine(i)));
        }
        return new Array<ParserEngine>();
    }

    parseRegexToStrings(regex: string, selects: Array<string | undefined>): Array<Array<string>> {
        return parseRegexToStrings(regex, selects, JSON.stringify(this.json));
    }

    toString(): string {
        return JSON.stringify(this.json);
    }

    toHTML(): string {
        return `<pre>${this.toString()}</pre>`;
    }

    toInnerHTML(): string {
        return `<pre>${this.toString()}</pre>`;
    }

}
