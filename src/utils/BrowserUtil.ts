import MessageUtil from "@/utils/modal/MessageUtil";

/**
 * 下载
 * @param data 内容
 * @param fileName 文件名
 * @param mineType 文件类型
 */
export function download(data: string | ArrayBuffer | Blob, fileName: string, mineType: string) {
    // 创建 blob
    let blob = data instanceof Blob ? data : new Blob([data], {type: mineType});
    // 创建 href 超链接，点击进行下载
    window.URL = window.URL || window.webkitURL;
    let href = URL.createObjectURL(blob);
    let downA = document.createElement("a");
    downA.href = href;
    downA.download = fileName;
    downA.click();
    // 销毁超连接
    window.URL.revokeObjectURL(href);
}

/**
 * 拷贝
 * @param content 内容
 * @param showMessage 显示消息，默认显示
 */
export function copy(content: string, showMessage: boolean = true) {
    // content为要复制的内容
    // 创建元素用于复制
    const ele = document.createElement('textarea');
    // 设置元素内容
    ele.value = content;
    // 将元素插入页面进行调用
    document.body.appendChild(ele);
    // 复制内容
    ele.select();
    // 将内容复制到剪贴板
    document.execCommand('copy');
    // 删除创建元素
    document.body.removeChild(ele);
    if (showMessage) {
        MessageUtil.success('已成功复制到剪切板');
    }
}

export function downloadByUrl(url: string, fileName?: string) {
    let downA = document.createElement("a");
    downA.href = url;
    let index = url.lastIndexOf("/");
    if (fileName) {
        downA.download = fileName;
    } else {
        downA.download = url.substring(index + 1, url.length);
    }
    downA.click();
}

/**
 * Uint8Array数组转字符串
 * @param uint8Array Uint8Array数组
 */
export function uint8ArrayToString(uint8Array: Uint8Array): string {
    let dataString = "";
    for (let i = 0; i < uint8Array.length; i++) {
        dataString += String.fromCharCode(uint8Array[i]);
    }
    return dataString

}

export function svg2png(svg: SVGSVGElement): Promise<string> {
    // 创建一个Image对象，用于保存生成的图片
    // 创建一个Canvas元素
    const canvas = document.createElement('canvas');
    // 获取Canvas上下文对象
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject("创建canvas对象错误");
    }
    // 获取SVG的宽高
    const svgRect = svg.getBoundingClientRect();
    // 设置Canvas的宽高与SVG相同
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    // 创建一个新的Image对象，用于绘制SVG
    const svgImage = new Image();
    // 将SVG转为Base64编码的data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;
    return new Promise<string>((resolve, reject) => {
        // 在Image对象中加载SVG
        svgImage.onload = () => {
            // 将SVG绘制到Canvas上
            ctx.drawImage(svgImage, 0, 0);
            // 将Canvas转为图片
            resolve(canvas.toDataURL('image/png'));
        };
        svgImage.onerror = e => reject(e);
        // 加载SVG
        svgImage.src = svgUrl;
    })
}

export function downloadByBase64(base64: string, fileName?: string) {
    let byteCharacters = atob(
        base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], {
        type: undefined,
    });
    let aLink = document.createElement("a");
    aLink.download = fileName || "图片名称.png"; //这里写保存时的图片名称
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}

/**
 * 美化数据单位
 *
 * @param {number} value 需要美化的值
 */
export function prettyDataUnit(value: number) {
    let gb = 1024 * 1024 * 1024.0;
    if (value > gb) {
        let temp = value / gb;
        return temp.toFixed(2) + 'GB';
    }
    let mb = 1024 * 1024.0;
    if (value > mb) {
        let temp = value / mb;
        return temp.toFixed(2) + 'MB';
    }
    let b = 1024.0;
    if (value > b) {
        let temp = value / b;
        return temp.toFixed(2) + 'KB';
    }
    return value + 'B';

}

export function generateUUID(): string {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function sleep(timestamp: number) {
    return new Promise<void>(resolve => setTimeout(resolve, timestamp));
}

const colors = [
    'red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue',
    'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray'];

export function randomColor(str?: string): string {
    let index = Math.floor(Math.random() * colors.length);
    if (str) {
        if (str.length <= colors.length - 1) {
            index = str.length;
        } else {
            index = str.length % colors.length;
        }
    }
    return colors[index]
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
export function base64toBlob(base64: string, type = 'application/octet-stream'): Blob {
    const bStr = atob(base64);
    let n = bStr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
    }
    return new Blob([u8arr], {type});
}

export function blobToBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve(reader.result as string);
            }else {
                reject("解析失败")
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 生成随机字符串
 * @param len 字符串长度
 * @return 字符串
 */
export function getRandomChar(len: number): string {
    const x = "0123456789qwertyuioplkjhgfdsazxcvbnm"; // 需要什么字符这里添加
    let tmp = "";
    const timestamp = new Date().getTime();
    for (let i = 0; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

export const getImageSize = (src: string): Promise<{width: number,height: number}> => {
    return new Promise(resolve => {
        let img = new Image()
        img.src = src
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height
            })
        }
        img.onerror = () => {
            resolve({
                width: 100,
                height: 100
            })
        }
    })
}
