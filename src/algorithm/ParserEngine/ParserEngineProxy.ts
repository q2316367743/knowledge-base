import {ParserEngine} from "@/algorithm/ParserEngine/types";
import {parseSelectWithJsCode, parseSelectWithReplace} from "@/algorithm/SelectUtil";

export class ParserEngineProxy implements ParserEngine {
    constructor(private engine: ParserEngine) {
    }

    parseRegexToStrings(regex: string, selects: Array<string | undefined>): Array<Array<string>> {
        return this.engine.parseRegexToStrings(regex, selects);
    }

    parseToEngines(select: string): Array<ParserEngine> {
        return this.engine.parseToEngines(select);
    }

    parseToString(select: string): string {
        return parseSelectWithJsCode(select, str =>
            parseSelectWithReplace(str, rule =>
                this.engine.parseToString(rule)));

    }

    toString(): string {
        return this.engine.toString();
    }

    toHTML(): string {
        return this.engine.toHTML();
    }

    toInnerHTML(): string {
        return this.engine.toInnerHTML();
    }
}
