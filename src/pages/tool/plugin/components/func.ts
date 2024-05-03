import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";

export function renderType(type: PluginSettingTypeEnum): string {
    switch (type) {
        case PluginSettingTypeEnum.THEME:
            return '主题';
        case PluginSettingTypeEnum.MARKDOWN_MENU:
            return 'markdown菜单';
        case PluginSettingTypeEnum.MARKDOWN_SYNTAX:
            return 'markdown语法';
        default:
            return '';
    }
}

export function parseType(content: string): PluginSettingTypeEnum | null {
    switch (content) {
        case 'theme':
            return PluginSettingTypeEnum.THEME;
        case 'markdown-menu':
            return PluginSettingTypeEnum.MARKDOWN_MENU;
        case 'markdown-syntax':
            return PluginSettingTypeEnum.MARKDOWN_SYNTAX;
        case 'markdown-template':
            return PluginSettingTypeEnum.MARKDOWN_TEMPLATE;
        default:
            return null;
    }
}
