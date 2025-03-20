import UpdateLog from "@/global/UpdateLog";
import MessageUtil from "@/utils/modal/MessageUtil";

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
  },
  goods: {
    all: '',
    note: '',
    todo: ''
  }
}

export default Constant;
const toFeedbackWebsite = (redirect: string) => {
  const url = `https://feedback.esion.xyz/#/auth?redirect=${encodeURIComponent(redirect)}&type=utools&pluginId=1894929764697055232`;
  // 获取uTools的服务token
  utools.fetchUserServerTemporaryToken().then((ret) => {
    // 使用uTools自带的uBrowser打开登录链接
    utools.ubrowser
      .goto(`${url}&accessToken=` + ret.token)
      .run({width: 1200, height: 800})
  }).catch(e => {
    utools.ubrowser
      .goto(url)
      .run({width: 1200, height: 800})
    console.error(e);
  });
};

export const toDoc = () => {
  toFeedbackWebsite('/plugin/1894929764697055232/faqs-more');
};
export const toUpdateLog = () => {
  toFeedbackWebsite('/plugin/1894929764697055232/change-log');
};


export function toFeedback() {
  // 设置「版本」
  const f1896795064271175680 = Constant.version;
  // 构造参数
  const params = encodeURIComponent(JSON.stringify({f1896795064271175680}));
  // 获取uTools的服务token
  utools.fetchUserServerTemporaryToken().then((ret) => {
    // 使用uTools自带的uBrowser打开登录链接
    utools.ubrowser
      .goto(`https://feedback.esion.xyz/#/auth?params=${params}&type=utools&pluginId=1894929764697055232&accessToken=` + ret.token)
      .run({width: 1200, height: 800})
  }).catch(e => {
    MessageUtil.error('请先登录');
    console.error(e);
  });
}

export const BASE64_PREFIX: string = 'data:image/png;base64,';