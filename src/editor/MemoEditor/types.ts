export interface MemoDataCardText {
  question: string;
  answer: string;
}

export interface MemoDataCardBlank {
  answer: string;
}

export interface MemoDataCardChoice {
  question: string;
  options: string[];
  answer: number;
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
}

export type MemoDataCardType = keyof MemoDataCardContentMap;

export enum MemoDataCardStatusEnum {
  // 未知
  UNKNOWN = 0,
  // 记住了
  REMEMBERED = 1,
  // 模糊
  BLUR = 2,
  // 不记得
  NOT_REMEMBERED = 3,
}

export interface MemoDataCard<T extends MemoDataCardType> {
  type: T;
  data: MemoDataCardContentMap[T];
  status: MemoDataCardStatusEnum;
}

export interface MemoData {
  version: string;
  cards: Array<MemoDataCard<MemoDataCardType>>
}

export function buildMemoData(): MemoData {
  return {
    version: '1.0.0',
    cards: [{
      type: 'TEXT',
      status: MemoDataCardStatusEnum.UNKNOWN,
      data: {
        question: '这是默认问题',
        answer: '这是默认答案'
      }
    }]
  }
}