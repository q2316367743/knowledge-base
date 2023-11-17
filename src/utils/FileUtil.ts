/**
 * 解析文件名字，去除拓展名
 * @param fileName 文件名字
 */
export function parseFileName(fileName: string): string {
    const indexOf = fileName.lastIndexOf(".");
    if (indexOf > -1) {
        return fileName.substring(0, indexOf);
    } else {
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
    return renderLanguage(extra);
}

export function renderLanguage(ext: string): string {
    ext = ext.trim();
    if (ext.startsWith(".")) {
        ext = ext.substring(1, ext.length);
    }
    // 部分后缀名与语言不符
    if (ext === 'vue') {
        return 'html';
    } else if (ext === 'md') {
        return 'markdown';
    } else if (ext === 'ts') {
        return 'typescript';
    } else if (ext === 'js') {
        return 'javascript';
    }else if (ext === 'py') {
        return 'python';
    }
    return ext;

}
