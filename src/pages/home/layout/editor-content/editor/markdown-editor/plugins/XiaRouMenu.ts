import Cherry from "cherry-markdown";
import {ShallowRef} from "vue";
import axios from "axios";
import MessageUtil from "@/utils/MessageUtil";

const YI_YAN: string = "https://v.api.aa1.cn/api/yiyan/index.php";
const AN_WEI: string = "https://v.api.aa1.cn/api/api-wenan-anwei/index.php?type=json";
const PENG_YOU_QUAN: string = "https://v.api.aa1.cn/api/pyq/index.php?aa1=json";
const TIAN_GOU_RI_JI: string = "https://v.api.aa1.cn/api/tiangou/index.php";
const QING_GAN: string = "https://v.api.aa1.cn/api/api-wenan-qg/index.php?aa1=json";
const MING_REN_MING_YAN: string = "https://v.api.aa1.cn/api/api-wenan-mingrenmingyan/index.php?aa1=json";

// 每日一言
export const useYiYanMenu = (editor: ShallowRef<Cherry | undefined>) => buildTextFunc(editor, "每日一言", YI_YAN);
// 舔狗日记
export const useTianGouRiJiMenu = (editor: ShallowRef<Cherry | undefined>) => buildTextFunc(editor, "舔狗日记", TIAN_GOU_RI_JI);
// 安慰文案
export const useAnWeiMenu = (editor: ShallowRef<Cherry | undefined>) => buildJsonFunc(editor, "安慰文案", AN_WEI, "anwei");
// 朋友圈一言
export const usePyqMenu = (editor: ShallowRef<Cherry | undefined>) => buildJsonFunc(editor, "朋友圈一言", PENG_YOU_QUAN, "pyq");
// 情感一言
export const useQingGanMenu = (editor: ShallowRef<Cherry | undefined>) => buildArrayFunc(editor, "情感一言", QING_GAN, "qinggan");
// 名人名言
export const useMingRenMingYanMenu = (editor: ShallowRef<Cherry | undefined>) => buildArrayFunc(editor, "名人名言", MING_REN_MING_YAN, "mingrenmingyan");

/**
 * 构建JSON方法
 * @param editor 编辑器
 * @param title 标题
 * @param url 链接
 * @param key 使用的key
 */
function buildJsonFunc(editor: ShallowRef<Cherry | undefined>, title: string, url: string, key: string) {
    return Cherry.createMenuHook(title, {
        name: title,
        onClick: function () {
            axios.get<Record<string, any>>(url, {responseType: "json", timeout: 5000})
                .then(result => {
                    const data = result.data;
                    if (editor.value) {
                        console.log(data, key, data[key])
                        editor.value.insert(data[key]);
                    }else {
                        MessageUtil.error("插入失败，编辑器未初始化")
                    }
                })
                .catch(e => MessageUtil.error("请求失败", e))
            return ''
        }
    });
}

/**
 * 构建JSON方法
 * @param editor 编辑器
 * @param title 标题
 * @param url 链接
 * @param key 使用的key
 */
function buildArrayFunc(editor: ShallowRef<Cherry | undefined>, title: string, url: string, key: string) {
    return Cherry.createMenuHook(title, {
        name: title,
        onClick: function () {
            axios.get<Array<Record<string, any>>>(url, {responseType: "json", timeout: 5000})
                .then(result => {
                    const data = result.data;
                    const first = data[0];
                    if (editor.value) {
                        editor.value.insert(first[key]);
                    }else {
                        MessageUtil.error("插入失败，编辑器未初始化")
                    }
                })
                .catch(e => MessageUtil.error("请求失败", e))
            return ''
        }
    });
}

/**
 * 构建Text方法
 * @param editor 编辑器
 * @param title 标题
 * @param url 链接
 * @param key 使用的key
 */
function buildTextFunc(editor: ShallowRef<Cherry | undefined>, title: string, url: string) {
    return Cherry.createMenuHook(title, {
        name: title,
        onClick: function () {
            axios.get<string>(url, {responseType: "text", timeout: 5000})
                .then(result => {
                    const data = result.data.trim();
                    const content = data.substring(3, Math.max(data.length - 4, 3));
                    if (editor.value) {
                        editor.value.insert(content);
                    }
                })
                .catch(e => MessageUtil.error("请求失败", e))
            return ''
        }
    });
}
