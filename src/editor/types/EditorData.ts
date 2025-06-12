import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {buildMindMapData} from "@/editor/MindMapEditor/constant";
import {useBaseSettingStore} from "@/store";
import {traverseNumber} from "@/utils/lang/ArrayUtil";
import {buildLogicFlowData, LogicFlowData} from "@/editor/LogicFlow/constants";
import {buildEncryptEditorData, EncryptEditorData} from "@/editor/EncryptEditor/EncryptEditorType";
import {MindMapTreeData} from "@/editor/MindMapEditor/domain";
import {OutputData} from "@editorjs/editorjs";
import {buildMemoData, MemoData} from "@/editor/MemoEditor/types";
import {AiChatWrap} from "@/entity/ai/AiChat";

export type EditorData = Record<string, any> |
  // 思维导图
  MindMapTreeData |
  // 流程图
  LogicFlowData |
  // 加密笔记
  EncryptEditorData |
  // 超级笔记
  OutputData |
  // 闪卡
  MemoData |
  // AI聊天
  AiChatWrap |
  // 富文本编辑器/markdown编辑器/代码笔记/drauu实现的画板
  // TODO: 此处要逐渐转为对象
  string

export async function buildDefaultContent(name: string, type: ArticleTypeEnum): Promise<EditorData> {
  switch (type) {
    case ArticleTypeEnum.MIND_MAP:
      return buildMindMapData();
    case ArticleTypeEnum.MEMO:
      return buildMemoData();
    case ArticleTypeEnum.EXCEL:
      return {};
    case ArticleTypeEnum.HANDSONTABLE:
      const {tableColumnCount, tableColCount} = useBaseSettingStore();
      return {
        data: [
          ...traverseNumber(tableColCount).map(() => {
            return [...traverseNumber(tableColumnCount).map(() => "")]
          })
        ],
        columns: []
      };
    case ArticleTypeEnum.MARKDOWN:
      // TODO: 查看是否有模板
      return '';
    case ArticleTypeEnum.LOGIC_FLOW:
      return buildLogicFlowData()
    case ArticleTypeEnum.SUPER_EDITOR:
      return {
        time: Date.now(),
        blocks: []
      };
    case ArticleTypeEnum.ENCRYPT_EDITOR:
      return buildEncryptEditorData();
    default:
      return "";
  }
}