import UpdateLog from "@/global/UpdateLog";

const Constant=  {
    uid: 'zdllh16g',
    id: 'knowledge-base',
    name: '知识库',
    version: UpdateLog[0].version,
    sign: UpdateLog[0].sign,
    author: '落雨不悔',
    txcId: '612648',
    website: 'https://blog.esion.xyz',
    feedback: 'https://txc.qq.com/products/612648',
    repo: 'https://gitee.com/qiaoshengda/knowledge-base',
    online: 'https://blog.esion.xyz/apps/knowledge-base',
    doc: "https://blog.esion.xyz/docs/knowledge-base/知识库.html",
    updateLog: 'https://txc.qq.com/products/612648/change-log',
    statistics: "http://project-esion.nat300.top/webhook/5e512530-23e3-4bf4-8fa7-1720da99a6b6",
    feature: {
        ADD: 'function:add-article',
        IMPORT: 'function:md-import',
        TODO_CATEGORY: 'todo:'
    },
    autoCollapsedWidth: 1080,
    goodsId: 'nrniJTkDF7bjDosiki1vjXxAxGNbUsG6',
    help: {
        plugin: 'https://blog.esion.xyz/index.php/2024/04/06/知识库-主题与插件/'
    }
}

export default Constant;

export const toTxc = () => utools.shellOpenExternal(Constant.feedback);
export const toDoc = () => utools.shellOpenExternal(Constant.doc);
