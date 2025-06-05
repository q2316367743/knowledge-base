import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {articleTypeMap} from "@/pages/note/components/he-context";
import {buildDefaultContent, EditorData} from "@/editor/types/EditorData";
import {
  buildArticleName,
  checkPower,
  useArticleStore,
  useBaseSettingStore,
  useFolderStore,
  useHomeEditorStore
} from "@/store";
import {ArticleIndex, getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";

interface AddArticleProps {
  pid: number;
  type: ArticleTypeEnum;
  name?: string;
  content?: EditorData;
  extra?: Partial<ArticleIndex>;
}

async function buildName(type: ArticleTypeEnum, pid: number, res?: string): Promise<string> {
  // 如果用户指定,则返回用户指定的文件名
  if (isNotEmptyString(res)) return res!;
  const {newArticleAutoName, newArticleTemplateByName, codeExtraName} = useBaseSettingStore();
  let name: string;
  if (newArticleAutoName) {
    name = buildArticleName(type, newArticleTemplateByName, codeExtraName, pid);
  } else {
    name = await MessageBoxUtil.prompt("请输入笔记名称", "新建笔记");
  }
  return name;

}

function buildContent(type: ArticleTypeEnum, name: string, content?: any): Promise<any> {
  if (content) return content;
  return buildDefaultContent(name, type);
}

export async function addNote(props: AddArticleProps) {
  const {pid, type, name, content} = props;
  const at = articleTypeMap.get(type);
  if (!at) return Promise.reject(new Error("文章类型未知"));
  if (at.vip) {
    // 检查是否是会员
    await checkPower('note');
  }
  const newName = await buildName(type, pid, name);
  const newContent = await buildContent(type, newName, content);
  // 获取文件夹规则
  const folder = useFolderStore().folderMap.get(pid);
  return useArticleStore().add(getDefaultArticleIndex({
    ...(props.extra || {}),
    name: newName,
    folder: pid,
    type,
    fontColor: folder?.diffusion ? folder?.fontColor : ''
  }), getDefaultArticleBase(), newContent);
}

export function addNoteFunc(props: AddArticleProps) {
  addNote(props).then(article => {
    // 自动打开
    MessageUtil.success("新增笔记成功");
    useHomeEditorStore().openArticle(article)
  }).catch((e) => {
    MessageUtil.error("新增笔记失败", e.message);
  });
}

export async function addSimpleNote(content: string): Promise<ArticleIndex> {
  return addNote({
    pid: 0,
    name: '导入笔记' + Date.now(),
    type: ArticleTypeEnum.MARKDOWN,
    content,
  })
}