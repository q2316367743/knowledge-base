import {DialogPlugin} from "tdesign-vue-next";

export function openArticleImport() {
  DialogPlugin({
    header: '文章导入',
    placement: 'center',
    mode: 'full-screen',
    footer: false,
    default: () => <div></div>
  })
}