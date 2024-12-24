import {useUmami} from "@/plugin/umami";


/**
 * 访问某个标签
 * @param event 操作
 * @param additional 附加
 */
export function access(event: string, additional?: string) {
  useUmami.track(event, additional);
}




