import ZoneMediaWrap from "./domain/ZoneMediaWrap";
import ZoneWrap from "./domain/ZoneWrap";
import Zone from "@/entity/zone";
import ZoneComment from "@/entity/zone/ZoneComment";
import md from "@/plugin/markdown";
import {VNode} from "vue";

export function getDefaultZoneWrap(): ZoneWrap {
    return {
        id: 0,
        createTime: new Date(),
        updateTime: new Date(),
        content: {
            location: '',
            tags: [],
            body: ''
        },
        imageWrap: [],
        comments: [],
        image: [],
        source: '',
        attachments: [],
        collect: false
    }
}

export function renderOne(e: Zone): ZoneWrap {
    // 获取正文
    let content = {
        location: '',
        tags: new Array<string>(),
        body: ''
    };
    let source = '';
    let contentSource = utools.db.get('/zone/content/' + e.id);
    if (contentSource) {
        content = Object.assign(content, contentSource.value);
        source = content.body;
        content.body = md.render(content.body); // 转换为html格式。
    }
    // 获取评论
    let comments = new Array<ZoneComment>();
    let commentWrap = utools.db.get('/zone/comment/' + e.id);
    if (commentWrap) {
        comments = commentWrap.value;
    }
    //  获取图片
    let imageWrap = new Array<ZoneMediaWrap>();
    if (e.image) {
        e.image.forEach(x => imageWrap.push({
            id: x.id,
            name: x.name,
            value: ''
        }));
    }
    // TODO: 获取视频
    // TODO: 获取声音
    // TODO: 获取附件
    return {
        ...e,
        content,
        comments,
        imageWrap,
        source
    };
}

/**
 * 渲染图片
 * @param e 事件
 * @param id 图片ID
 * @returns 图片base64形式
 */
export function renderImage(e: VNode, id: string) {
    renderLazyByArcoImage(e, '/zone/attachment/' + id);
}

export function transformUint8ArrayToBase64(array: Uint8Array): string {
    let binary = "";
    for (let len = array.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(array[i]);
    }
    return window.btoa(binary).replace(/=/g, "");
}


export function renderLazyByArcoImage(e: VNode, _id: string, callback?: () => void) {
    let el = e.el as HTMLDivElement;
    let img = el.querySelector('img');
    utools.db.promises.getAttachment(_id)
        .then(buffer => {
            if (buffer) {
                if (img) {
                    img.src = 'data:image/png;base64,' + transformUint8ArrayToBase64(buffer);
                    if (callback) {
                        callback();
                    }
                }
            }
        });
}
