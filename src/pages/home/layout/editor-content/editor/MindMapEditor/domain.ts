export interface MindMapNode {
    // 是否是根节点
    isRoot: boolean;
    // 是否是概要
    isGeneralization: boolean;
    // 设置图片
    setImage(data: {
        url: string;
        title: string;
        width: number;
        height: number;
    }): void;
    getData(type: string): any;
    setHyperlink(url: string, title: string): void;
    setNote(note: string): void;
    setTag(tags: Array<string>): void;
    setIcon(icons: Array<string>): void;
}
