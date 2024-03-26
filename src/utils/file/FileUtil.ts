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
    return paths.join(utools.isWindows() ? '\\' : '/');
}

export function parseFileExtra(fileName: string): string {
    // 部分后缀名与语言不符
    return renderLanguage(extname(fileName));
}

export function extname(fileName: string): string {
    return fileName.split('.').pop() || '';
}

export function basename(fileName: string): string {
    const s = fileName.split('/').pop() || '';
    const t = fileName.split("\\").pop() || '';
    return s.length > t.length ? t : s;
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
    } else if (ext === 'py') {
        return 'python';
    }
    return ext;
}

export function renderFileExtraName(language: string) {
    // 部分后缀名与语言不符
    if (language === 'markdown') {
        return 'md';
    } else if (language === 'typescript') {
        return 'ts';
    } else if (language === 'javascript') {
        return 'js';
    } else if (language === 'python') {
        return 'py';
    }
    return language;
}

export function readAsText(file: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = function () {
            const text = fileReader.result as string;
            resolve(text);
        }
        fileReader.onerror = function (e) {
            reject(e);
        }
        fileReader.readAsText(file);
    });
}
