import Cherry from "cherry-markdown";

/**
 * @param {string} hookName 语法名
 * @param {string} type 语法类型，行内语法为Cherry.constants.HOOKS_TYPE_LIST.SEN，段落语法为Cherry.constants.HOOKS_TYPE_LIST.PAR
 * @param {object} options 自定义语法的主体逻辑
 */
export const RelationArticleSyntaxHook = Cherry.createSyntaxHook(
    'relation-article',
    Cherry.constants.HOOKS_TYPE_LIST.SEN,
    {
        makeHtml(str: string) {
            return str.replace(this.RULE.reg, function (_whole, m1) {
                return `<span class="arco-link relation-article" data-title="${encodeURIComponent(m1)}">${m1}</span>`;
            });
        },
        rule() {
            return {reg: /\[\[(.*)]]/g};
        },
    });
