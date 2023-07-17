import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
    html: true,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    // 启用一些语言中立的替换 + 引号美化
    typographer: false,
    // 双 + 单引号替换对，当 typographer 启用时。
    // 或者智能引号等，可以是 String 或 Array。
    //
    // 比方说，你可以支持 '«»„“' 给俄罗斯人使用， '„“‚‘'  给德国人使用。
    // 还有 ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] 给法国人使用（包括 nbsp）。
    quotes: '“”‘’',
});
md.options.highlight = function (str, lang) {
    // 此处判断是否有添加代码语言
    if (lang && hljs.getLanguage(lang)) {
        try {
            // 得到经过highlight.js之后的html代码
            const preCode = hljs.highlight(str, {
                language: lang,
                ignoreIllegals: true
            }).value
            // 以换行进行分割
            const lines = preCode.split(/\n/).slice(0, -1)
            // 添加自定义行号
            let html = lines.map((item, index) => {
                return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
            }).join('')
            html = '<ol>' + html + '</ol>'
            return '<pre class="hljs"><code>' +
                html +
                '</code></pre>'
        } catch (__) { }
    }
    // 未添加代码语言，此处与上面同理
    const preCode = md.utils.escapeHtml(str);
    const lines = preCode.split(/\n/).slice(0, -1)
    let html = lines.map((item, index) => {
        return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
    }).join('')
    html = '<ol>' + html + '</ol>'
    return '<pre class="hljs"><code>' +
        html +
        '</code></pre>'
};


// 如果覆盖，或者是对默认渲染器的代理，则记住老的渲染器。
var defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // 如果你确认其他的插件不能添加 `target` - 放弃以下检查：
    let aIndex = tokens[idx].attrIndex('target');
    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // 添加新属性
    } else {
        tokens[idx].attrs![aIndex][1] = '_blank';    // 替换已经存在的属性值
    }
    let hrefIndex = tokens[idx].attrIndex('href');
    if (hrefIndex > -1) {
        let clickIndex = tokens[idx].attrIndex('onclick');
        let href = tokens[idx].attrs![hrefIndex][1];
        if (clickIndex < 0) {
            tokens[idx].attrPush(['onclick', `window.utools.shellOpenExternal('${href}')`]); // 添加新属性
        } else {
            tokens[idx].attrs![hrefIndex][1] = `window.utools.shellOpenExternal('${href}')`;    // 替换已经存在的属性值
        }
    }

    // 传递 token 到默认的渲染器。
    return defaultRender(tokens, idx, options, env, self);
};

export default md;