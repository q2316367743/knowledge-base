import {defineStore} from "pinia";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";
import {DialogPlugin, Paragraph, Text, Title} from "tdesign-vue-next";
import {JSX} from 'vue/jsx-runtime';

export const useVipStore = defineStore('vip', () => {
  const noteVip = ref(false);
  const todoVip = ref(false);
  const allVip = ref(false);

  async function init() {
    const payments = await utools.fetchUserPayments();
    for (const payment of payments) {
      if (payment.goods_id === Constant.goods.note) {
        noteVip.value = true;
      } else if (payment.goods_id === Constant.goods.note) {
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
    let goodsId: string;
    if (type === 'note') {
      goodsId = Constant.goods.note;
    } else if (type === 'todo') {
      goodsId = Constant.goods.todo;
    } else {
      goodsId = Constant.goods.all;
    }
    // TODO: 暂时不开放购买功能
    // return new Promise<void>((resolve, reject) => {
    //   try {
    //     utools.openPurchase({
    //       goodsId
    //     }, () => resolve());
    //   } catch (e) {
    //     reject(e);
    //   }
    // })
    allVip.value = true;
    return Promise.resolve();
  }

  return {
    noteNoVip, todoNoVip, allNoVip,
    openVip
  }

});

function noteHeader() {
  return () => <Paragraph>
    <Text strong class={'text-lg'}>开通笔记会员</Text>
    <Text theme={'secondary'}> ——— 解锁「超级笔记」的无限可能</Text>
  </Paragraph>
}

function todoHeader() {
  return () => <Text strong>开通待办会员</Text>
}

function allHeader() {
  return () => <Text strong>开通会员</Text>
}

function noteVip() {
  return () => <div>
    <Paragraph>
      作为「知识库」笔记会员的专属权益，「超级笔记」突破传统笔记的局限，将记录、创作与协作提升至全新维度。
    </Paragraph>
    <Title level={'h3'}>主要功能亮点</Title>
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
    <Title level={'h3'}>未来功能</Title>
    <Paragraph>
      <ul>
        <li><Text strong>关联笔记网络</Text>：支持嵌套插入现有笔记，自动生成目录索引，构建知识图谱。</li>
        <li><Text strong>多媒体嵌入</Text>：视频（支持腾讯、哔哩哔哩外链）、音频模块可边播放边标注重点，学习效率倍增。</li>
        <li><Text strong>智能表格升级</Text>：支持数据自动统计、进度条可视化，表格内可嵌入录音、附件或关联笔记，灵活呈现复杂信息。
        </li>
        <li><Text strong>AI能力强化升级</Text>：随着uTools对插件AI能力的有力支持，AI助手将迎来全方位的显著增强，并与超级笔记实现深度融合。融合后的功能极为强大，不仅能够对内容进行智能摘要、高效生成各类模板、精准翻译文本，还支持基于笔记内容的智能问答交互，极大地提升了笔记应用的智能化水平与使用体验
          。
        </li>
      </ul>
    </Paragraph>
    <Paragraph>
      立即升级，开启智能记录时代
    </Paragraph>
    <Paragraph>
      超级笔记不仅是工具，更是知识创造的引擎。无论是个人学习、团队协作还是专业创作，超级笔记将助您释放创造力，高效管理信息资产。
    </Paragraph>
  </div>
}

function todoVip() {
  return () => <div>待办会员</div>
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
          resolve();
          instance.destroy();
        }).catch(reject);
      },
      onCancel: () => {
        instance.destroy();
        reject(new Error('取消开通会员'));
      }
    });
  })

}