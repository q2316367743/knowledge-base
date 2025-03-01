import EditorjsList from '@editorjs/list';
import {IconListBulleted, IconListNumbered, IconChecklist} from '@codexteam/icons';
import {BlockTool, ToolboxConfig} from "@editorjs/editorjs";

export default class List extends EditorjsList implements BlockTool {

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  static get toolbox(): ToolboxConfig {
    return [
      {
        icon: IconListBulleted,
        title: '无需列表',
        data: {
          style: 'unordered',
        },
      },
      {
        icon: IconListNumbered,
        title: '有序列表',
        data: {
          style: 'ordered',
        },
      },
      {
        icon: IconChecklist,
        title: '待办列表',
        data: {
          style: 'checklist',
        },
      },
    ];
  }
}