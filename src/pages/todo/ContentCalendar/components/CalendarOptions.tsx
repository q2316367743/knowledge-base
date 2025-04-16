import {DropdownOption} from "tdesign-vue-next";
import {AppIcon, CopyIcon, FileImageIcon} from "tdesign-icons-vue-next";

export const buildCalendarOptions = (len: number, onCancel: () => void): Array<DropdownOption> => ([{
  content: '取消选择',
  disabled: len === 0,
  onClick: onCancel
}, {
  content: '批量处理',
  prefixIcon: () => <AppIcon/>,
  children: [{
    content: '设为今日'
  }, {
    content: '设为完成'
  }, {
    content: '设为未完成'
  }, {
    content: '删除'
  }]
}, {
  content: '复制待办',
  prefixIcon: () => <CopyIcon/>,
  children: [{
    content: 'Markdown'
  }, {
    content: '文本列表'
  }]
}, {
  content: '导入待办',
  prefixIcon: () => <FileImageIcon/>,
  children: [{
    content: '从剪切板导入'
  }]
}]);