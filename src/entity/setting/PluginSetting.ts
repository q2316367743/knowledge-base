export enum PluginSettingTypeEnum {
    THEME = 1,
    MARKDOWN_MENU =2,
    MARKDOWN_SYNTAX = 3,
    /**
     * 富文本插件
     * 展示不启用
     */
    RICH_TEXT_PLUGIN = 4,

    MARKDOWN_TEMPLATE = 5,
}

export interface PluginSettingIndex {
    id: number;
    name: string;
    type: PluginSettingTypeEnum;
    originId?: number,
    originApplicationId?: number,
}

export interface PluginSettingContent {
    id: number;
    content: string;
    // 描述。不超过255个字
    description?: string;
}
