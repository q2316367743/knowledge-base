import Cherry from "cherry-markdown";

/**
 * 截屏菜单
 */
export const useFanYi = () => {
    return Cherry.createMenuHook('翻译',  {
        onClick: function(selection: string) {
            utools.redirect(["聚合翻译", "翻译"], selection);
            return ""
        }
    });
}
