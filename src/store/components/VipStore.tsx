import {defineStore} from "pinia";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";
import {DialogPlugin, Paragraph, Text, Title} from "tdesign-vue-next";
import {JSX} from 'vue/jsx-runtime';
import {useUmami} from "@/plugin/umami";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export const useVipStore = defineStore('vip', () => {
  const noteVip = ref(false);
  const todoVip = ref(false);
  const allVip = ref(false);

  async function init() {
    noteVip.value = false;
    todoVip.value = false;
    allVip.value = false;
    const payments = await InjectionUtil.payment.fetch();
    for (const payment of payments) {
      if (payment.goods_id === Constant.goods.note) {
        noteVip.value = true;
      } else if (payment.goods_id === Constant.goods.todo) {
        todoVip.value = true;
      } else if (payment.goods_id === Constant.goods.all) {
        allVip.value = true;
        return;
      }
    }
  }

  init()
    .then(() => console.debug('vip init success'))
    .catch(e => MessageUtil.error('vip init error', e));

  const noteNoVip = computed(() => allVip.value ? false : !noteVip.value);
  const todoNoVip = computed(() => allVip.value ? false : !todoVip.value);
  const allNoVip = computed(() => !allVip.value);

  async function openVip(type: 'note' | 'todo' | 'all') {
    // 为避免重复开通，此处再次教研
    await init();
    let goodsId: string;
    if (type === 'note') {
      goodsId = Constant.goods.note;
      if (noteVip.value) {
        MessageUtil.warning("您已开通VIP，请勿重复开通！");
        return Promise.resolve();
      }
    } else if (type === 'todo') {
      goodsId = Constant.goods.todo;
      if (todoVip.value) {
        MessageUtil.warning("您已开通VIP，请勿重复开通！");
        return Promise.resolve();
      }
    } else {
      goodsId = Constant.goods.all;
      if (allVip.value) {
        MessageUtil.warning("您已开通VIP，请勿重复开通！");
        return Promise.resolve();
      }
    }
    return new Promise<void>((resolve, reject) => {
      try {
        useUmami.track(`/VIP/${type}/准备`);
        InjectionUtil.payment.open({
          goodsId
        }, () => {
          console.debug(`购买${type}成功`);
          useUmami.track(`/VIP/${type}/开通`);
          MessageUtil.success("开通VIP成功");
          // 重新初始化
          init();
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    })
    // allVip.value = true;
    // return Promise.resolve();
  }

  return {
    noteNoVip, todoNoVip, allNoVip,
    openVip
  }

});

function noteHeader() {
  return () => <Paragraph>
    <Text strong class={'text-lg'}>开通笔记会员</Text>
    <Text theme={'secondary'}> ——— 解锁「笔记」的无限可能</Text>
  </Paragraph>
}

function todoHeader() {
  return () => <Paragraph>
    <Text strong class={'text-lg'}>开通待办会员</Text>
    <Text theme={'secondary'}> ——— 赋予桌面小部件魔法，待办随心编辑，邂逅灵活有序新日常</Text>
  </Paragraph>
}

function allHeader() {
  return () => <Text strong>开通会员</Text>
}

function noteVip() {
  return () => <div>
    <Paragraph>
      在信息爆炸的时代，高效记录和安全存储信息变得至关重要。笔记会员服务应运而生，旨在为用户提供一个功能丰富、安全可靠的笔记平台，满足您多样化的记录需求。
    </Paragraph>
    <Title level={'h3'}>超级笔记</Title>
    <Paragraph>
      超级笔记是笔记会员服务的核心功能之一，它为用户提供了一个强大而便捷的笔记创作与管理空间。无论您是学生记录课堂知识、职场人士整理工作思路，还是创作者捕捉灵感，超级笔记都能满足您的需求。
    </Paragraph>
    <Paragraph>
      <ul>
        <li><Text strong>富文本增强</Text>：支持三级标题、字体样式、高亮标注、项目列表等，轻松打造结构化文档。</li>
        <li><Text strong>可运行代码块</Text>：支持Python、JavaScript等主流语言，代码实时渲染并可在线执行，适合技术学习与团队协作。
        </li>
        <li><Text strong>智能思维导图</Text>：一键生成思维导图，节点可自由拖拽扩展，支持关联笔记与附件，让灵感可视化。</li>
        <li><Text strong>流程图</Text>：内置专业流程图工具，涵盖流程图的全功能范畴，突破传统限制，让笔记告别单一文字模式，以直观、生动的图形化形式展现内容
          。
        </li>
        <li><Text strong>看板</Text>：通过看板功能，实现简洁待办功能。</li>
        <li><Text strong>加密文本模块</Text>：设置密码后，只有通过解锁才可查看，保障隐私安全。</li>
      </ul>
    </Paragraph>
    <Title level={'h3'}>加密笔记</Title>
    <Paragraph>
      在当今数字化时代，信息安全尤为重要。加密笔记功能为您的敏感信息提供了可靠的保护。
    </Paragraph>
    <Paragraph>
      <ul>
        <li><Text strong>高强度加密算法</Text>：采用先进的加密技术，对您的笔记内容进行加密处理。只有输入正确的密码，才能查看和编辑加密笔记，确保您的隐私不被泄露。
        </li>
        <li>
          <Text strong>灵活的编辑器选择</Text>：支持富文本、Markdown等编辑模式，让您自由选择最适合的编辑方式。
        </li>
      </ul>
    </Paragraph>
  </div>
}

function todoVip() {
  return () => <div>
    <Paragraph>
      成为待办会员，解锁高效生活新方式。专属桌面小部件，让待办管理一步到位。无需进入应用，直接在桌面编辑、查看待办事项，操作随心。
    </Paragraph>
    <Paragraph>
      灵活的使用体验，帮你快速记录、调整安排，无论何时何地，都能轻松把控任务进度，提升效率。
    </Paragraph>
  </div>
}

function allVip() {
  return () => <div>联合会员</div>
}

type RenderElement = () => JSX.Element;

export async function checkPower(type: 'note' | 'todo' | 'all') {
  const vipStore = useVipStore();
  let isNoVip: boolean;
  let header: RenderElement;
  let content: RenderElement;

  if (type === 'note') {
    header = noteHeader();
    content = noteVip();
    isNoVip = vipStore.noteNoVip;
  } else if (type === 'todo') {
    header = todoHeader();
    content = todoVip();
    isNoVip = vipStore.todoNoVip;
  } else {
    header = allHeader();
    content = allVip();
    isNoVip = vipStore.allNoVip;
  }
  // 打开窗口进行提示
  if (!isNoVip) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    useUmami.track(`/VIP/${type}/查看`);
    const instance = DialogPlugin({
      header,
      placement: 'center',
      closeOnOverlayClick: false,
      closeOnEscKeydown: false,
      closeBtn: false,
      confirmBtn: {
        default: '开通'
      },
      default: content,
      width: 750,
      onConfirm: () => {
        vipStore.openVip(type).then(() => {
          instance.destroy();
          resolve();
        }).catch(reject);
      },
      onCancel: () => {
        instance.destroy();
        reject(new Error('取消开通会员'));
      }
    });
  })

}