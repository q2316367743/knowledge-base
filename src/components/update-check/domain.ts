export interface Repository {

    name: string;

    url: string;

}

export interface Log {

    version: string;

    sign: number;

    time: string;

    items: Array<string | LogItem | Array<string>>

    title?: string;

    /**
     * 文档地址
     */
    doc?: string;

    /**
     * 描述
     */
    remark: string;

    /**
     * 更新的链接
     */
    url?: string;

}

export interface LogItem {

    label: LogItemEnum;

    content: string;

}

export enum LogItemEnum {

    /**
     * 新增
     */
    ADD = 1,

    /**
     * 优化
     */
    OPTIMIZATION = 2,

    /**
     * 修复
     */
    REPAIR = 3,

    /**
     * 更新/改版
     */
    UPDATE = 4,

    /**
     * 重大更新
     */
    MAJOR = 5

}

export interface Item {

    type: ItemType,

    value: string;

    addon?: string

}

export type ItemType = 'string' | 'link';


export interface Version {
    main: number;
    sub: number;
    dot: number;
}

export function parseVersion(str: string): Version {
    try {
        if (str) {
            const split = str.split('.');
            return {
                main: parseInt(split[0]),
                sub: parseInt(split[1]),
                dot: parseInt(split[2])
            }
        }
        return {
            main: 0,
            sub: 0,
            dot: 0
        }
    } catch (e) {
        console.error("版本解析失败", e);
        return {
            main: 0,
            sub: 0,
            dot: 0
        }
    }
}
