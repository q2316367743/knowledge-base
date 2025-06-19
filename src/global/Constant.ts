import UpdateLog from "@/global/UpdateLog.json";
import MessageUtil from "@/utils/modal/MessageUtil";
import {versionLess} from "@/utils/lang/FieldUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

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
  feedback_base: 'https://feedback.esion.xyz',
  feedback_id: '1894929764697055232',
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
    all: '6ruxx1z1o72gonrpwponq4gonwi1v2ix',
    note: '5v6oq0mkukbzcjdc0y5mitz4pkglwl1q',
    todo: 'nu9lc6yed8zx80dc6ry5fruyjblrwh7s'
  },
  background: {
    rss: 'https://knowledge-nase.esion.xyz/article/rss.html'
  }
}

export default Constant;
const toFeedbackWebsite = (redirect: string) => {
  InjectionUtil.browser.feedback({redirect})
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
  InjectionUtil.browser.feedback({params}).catch(e => {
    MessageUtil.error('请先登录');
    console.error(e);
  });
}

export const BASE64_PREFIX: string = 'data:image/png;base64,';

export function openRssBackground() {
  InjectionUtil.browser.openUrl(Constant.background.rss);
}

export const openNoteVipWebsite = () => InjectionUtil.shellOpenExternal('https://blog.esion.xyz/archives/knowledge-base-note-vip');
export const openTodoVipWebsite = () => InjectionUtil.shellOpenExternal('https://blog.esion.xyz/archives/knowledge-base-todo-vip');
export const openAuthorMoment = () =>InjectionUtil.browser.openUrl("https://moment.esion.xyz", 414, 869)