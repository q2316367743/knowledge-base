import {setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import axios from "axios";
import MessageUtil from "@/utils/modal/MessageUtil";


export function init() {
    axios.get('./example/article.md', {
        responseType: 'text',
    }).then(rsp => {
        setItem<string>(LocalNameEnum.KEY_EDITOR_CONTENT, rsp.data)
    }).catch(e => MessageUtil.error("获取默认笔记失败", e))
}
