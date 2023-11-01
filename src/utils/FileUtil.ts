/**
 * 解析文件名字，去除拓展名
 * @param fileName 文件名字
 */
export function parseFileName(fileName: string): string {
    const indexOf = fileName.lastIndexOf(".");
    if (indexOf > -1) {
        return fileName.substring(0, indexOf);
    }else {
        return fileName;
    }
}


export function pathJoin(...paths: string[]): string {
    return paths.join("/")
}

export function parseFileExtra(fileName: string): string {
    const indexOf = fileName.lastIndexOf(".");
    let extra = 'text'
    if (indexOf > -1) {
        extra = fileName.substring(indexOf + 1);
    }
    // 部分后缀名与语言不符
    if (extra === 'vue') {
        return 'html';
    }else if (extra === 'md') {
        return 'markdown';
    }else if (extra === 'ts') {
        return 'typescript';
    }else if (extra === 'js') {
        return 'javascript';
    }
    return extra;
}
