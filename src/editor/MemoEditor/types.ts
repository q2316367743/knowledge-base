import dayjs from "dayjs";

export interface MemoDataCardText {
  question: string;
  answer: string;
  // 解析
  analysis: string;
}

export interface MemoDataCardBlank {
  answer: string;
}

export interface MemoDataCardWord {
  // 单词
  word: string;
  // 解释
  meaning: Array<{
    // 词性
    partOfSpeech: string;
    // 翻译
    translation: string;
  }>;
  // 例句
  examples: Array<{
    // 句子
    sentence: string;
    // 翻译
    translation: string;
  }>;
}


export interface MemoDataCardChoice {
  question: string;
  options: Array<{
    // 选项
    label: string;
    // 是否是正确的
    value: boolean;
  }>;
  // 解析
  analysis: string;
}

export interface MemoDataCardContentMap {
  // 记忆卡：歧视就是问题、答案，简答题
  'TEXT': MemoDataCardText;
  // 填空卡：填空题
  'BLANK': MemoDataCardBlank;
  // 选择卡：选择题
  'CHOICE': MemoDataCardChoice;
  // 单词卡
  'WORD': MemoDataCardWord;
}

export type MemoDataCardType = 'TEXT' | 'BLANK' | 'CHOICE' | 'WORD';

export const renderMemoDataCardType = (type: MemoDataCardType) => {
  switch (type) {
    case 'TEXT':
      return '记忆卡';
    case 'BLANK':
      return '填空卡';
    case 'WORD':
      return '单词卡';
    case 'CHOICE':
      return '选择卡';
    default:
      return '未知卡';
  }
}

export enum MemoDataCardStatusEnum {
  // 未知、未学习、彻底忘记
  UNKNOWN = 0,
  // 记住了，12小时
  REMEMBERED = 1,
  // 模糊，7.2小时
  BLUR = 2,
  // 不记得，3.6小时
  NOT_REMEMBERED = 3,
  // 完成学习，不再学习
  COMPLETED = 4
}

export interface MemoDataCard<T extends MemoDataCardType> {
  // 类型
  type: T;
  // 数据
  data: Partial<MemoDataCardContentMap[T]>;
  // 状态
  status: MemoDataCardStatusEnum;
  // 创建时间
  createAt: number;
  // 创建日期，用于分组
  createDate: string;
  // 上次学习时间，0为未学习
  lastLearnedAt: number;
  // 背景颜色，默认使用主题色
  bgColor: string;
  // 是否收藏、重点标记
  star?: boolean;
}

export interface MemoDataSetting {
  theme?: string;
  music: boolean;
}

export interface MemoData {
  version: string;
  // 上次学习到哪里了
  index: number;
  // 卡片
  cards: Array<MemoDataCard<MemoDataCardType>>;
  // 设置
  setting: MemoDataSetting;
}

export function buildMemoDataCard<T extends MemoDataCardType>(type: T, data: Partial<MemoDataCardContentMap[T]>): MemoDataCard<T> {
  const createAt = Date.now();
  const createDate = dayjs(createAt).format("YYYY年MM月DD日");
  return {
    type,
    data,
    status: MemoDataCardStatusEnum.UNKNOWN,
    createAt,
    createDate,
    lastLearnedAt: 0,
    bgColor: ''
  }
}

export function buildMemoData(): MemoData {
  return {
    version: '1.0.0',
    index: 0,
    cards: [buildMemoDataCard('TEXT', {
      question: '这是默认问题',
      answer: '这是默认答案'
    })],
    setting: {
      music: false
    }
  }
}

export interface IMemoInstance {
  onAdd: (card: MemoDataCard<MemoDataCardType>) => void;
  onUpdate: (index: number, card: MemoDataCard<MemoDataCardType>) => void;
  onDelete: (index: number) => void;
  onStar: (index: number) => void;
  getIndex: () => number;
  setIndex: (index: number) => void;
  study: (index: number, status: MemoDataCardStatusEnum) => void;
  updateSetting: (setting: MemoDataSetting) => void
}

export const MemoInstance = Symbol() as InjectionKey<IMemoInstance>;