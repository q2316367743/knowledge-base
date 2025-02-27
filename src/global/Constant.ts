import UpdateLog from "@/global/UpdateLog";

const Constant = {
  uid: 'zdllh16g',
  id: 'knowledge-base',
  name: '知识库',
  version: UpdateLog[0].version,
  sign: UpdateLog[0].sign,
  author: '落雨不悔',
  txcId: '612648',
  website: 'https://blog.esion.xyz',
  feedback: 'https://feedback.esion.xyz/#/plugin/1894929764697055232/home',
  repo: 'https://gitee.com/qiaoshengda/knowledge-base',
  doc: "https://feedback.esion.xyz/#/plugin/1894929764697055232/faqs-more",
  updateLog: 'https://feedback.esion.xyz/#/plugin/1894929764697055232/change-log',
  feature: {
    ADD: 'function:add-article',
    IMPORT: 'function:md-import',
    TODO_CATEGORY: 'todo:'
  },
  autoCollapsedWidth: 1080,
  goodsId: 'nrniJTkDF7bjDosiki1vjXxAxGNbUsG6',
  help: {
    plugin: 'https://blog.esion.xyz/archives/知识库-主题与插件'
  },
  umami: {
    id: 'de82e31d-1399-4aca-a90a-21db9e2b87f4',
    url: 'https://umami.esion.xyz'
  }
}

export default Constant;

export const toTxc = () => utools.shellOpenExternal(Constant.feedback);
export const toDoc = () => utools.shellOpenExternal(Constant.doc);


export const BASE64_PREFIX: string = 'data:image/png;base64,';