import HttpResponse from "@/types/HttpResponse";
import {JsonParseEngine} from "@/algorithm/ParserEngine/JsonParseEngine";
import {DomParseEngine} from "@/algorithm/ParserEngine/DomParseEngine";
import {isJSON} from "@/utils/lang/FieldUtil";
import {ParserEngineProxy} from "@/algorithm/ParserEngine/ParserEngineProxy";
import {ParserEngine} from "@/algorithm/ParserEngine/types";

export function buildParseEngine(response: HttpResponse<string>): ParserEngine {
  const {headers, data} = response;
  const contentType = headers["content-type"] || "";
  let engine: ParserEngine;
  if (contentType.includes("application/json")) {
    // 优先判断是否是 JSON
    engine = new JsonParseEngine(data);
  } else if (contentType.includes("text/html")) {
    // 其次判断是否是 HTML
    engine = new DomParseEngine(data);
  } else {
    // 其他情况根据内容判断
    if (isJSON(data)) {
      engine = new JsonParseEngine(data);
    } else {
      engine = new DomParseEngine(data);
    }
  }
  return new ParserEngineProxy(engine);
}

export function buildHtmlEngine(html: string) {
  return new ParserEngineProxy(new DomParseEngine(html));
}