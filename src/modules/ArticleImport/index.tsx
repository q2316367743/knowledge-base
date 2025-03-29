import {DialogPlugin} from "tdesign-vue-next";
import {versionGreaterEqual} from "@/utils/lang/FieldUtil";

export function openArticleImport() {
  if (versionGreaterEqual(utools.getAppVersion(), 7)) {
    openArticleImportWithUBrowser();
  } else {
    openArticleImportWithPlugin();
  }
}

export function openArticleImportWithPlugin() {
  utools.redirect(["网页剪报", "网页剪报"], "");
}


export function openArticleImportWithUBrowser() {
  DialogPlugin({
    header: '文章导入',
    placement: 'center',
    mode: 'full-screen',
    footer: false,
    default: () => <div></div>
  })
}