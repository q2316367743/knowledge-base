import {useUmami} from "@/plugin/umami";
import {
  IconBook,
  IconBranch,
  IconCode,
  IconFile,
  IconMindMapping,
  IconNav,
  IconRefresh
} from "@arco-design/web-vue/es/icon";
import {Button, DialogPlugin, Form, FormItem, Input, Radio, RadioGroup, TreeSelect} from "tdesign-vue-next";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
// 存储
import {useArticleStore} from "@/store/db/ArticleStore";
import {buildArticleName, useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useFolderStore} from "@/store/db/FolderStore";
// 工具类
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {map, traverseNumber} from "@/utils/lang/ArrayUtil";
// 组件
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
// 图标
import FileMarkdown from '@/components/KbIcon/FileMarkdown.vue';
import IconRichText from '@/components/KbIcon/FileRichText.vue';
import FileCode from '@/components/KbIcon/FileCode.vue';
import FileMindMap from '@/components/KbIcon/FileMindMap.vue';
import FileHandsontable from '@/components/KbIcon/FileHandsontable.vue';
import FileLct from "@/components/KbIcon/FileLct.vue";
import FileEncrypt from '@/components/KbIcon/FileEncrypt.vue';
import {buildMindMapData} from "@/editor/MindMapEditor/constant";
import {buildLogicFlowData} from "@/editor/LogicFlow/constants";
import {LockOnIcon, StickyNoteIcon} from "tdesign-icons-vue-next";
import FileSuperNote from "@/components/KbIcon/FileSuperNote.vue";
import {addNote} from "@/utils/component/AddNoteUtil";
import {buildEncryptEditorData} from "@/editor/EncryptEditor/EncryptEditorType";

// ------------------------------------------------------------------------------------------------------
// ----------------------------------------------- 全局配置 -----------------------------------------------
// ------------------------------------------------------------------------------------------------------
interface ArticleTypeList {
  key: ArticleTypeEnum;
  name: string;
  icon: any;
  lock: any;
  vip?: boolean;
}

export const articleTextTypes: Array<ArticleTypeList> = [
  {
    key: ArticleTypeEnum.SUPER_EDITOR,
    name: '超级笔记',
    icon: shallowRef(StickyNoteIcon),
    lock: FileSuperNote,
    vip: true
  }, {
    key: ArticleTypeEnum.RICH_TEXT,
    name: '富文本',
    icon: shallowRef(IconBook),
    lock: IconRichText
  }, {
    key: ArticleTypeEnum.MARKDOWN,
    name: 'markdown',
    icon: shallowRef(IconFile),
    lock: FileMarkdown
  }, {
    key: ArticleTypeEnum.CODE,
    name: '代码',
    icon: shallowRef(IconCode),
    lock: FileCode
  }, {
    key: ArticleTypeEnum.MIND_MAP,
    name: '思维导图',
    icon: shallowRef(IconMindMapping),
    lock: FileMindMap
  }]

export const mainNoteTypes: Array<ArticleTypeList> = [
  ...articleTextTypes, {
    key: ArticleTypeEnum.HANDSONTABLE,
    name: '表格',
    icon: shallowRef(IconNav),
    lock: FileHandsontable
  }, {
    key: ArticleTypeEnum.LOGIC_FLOW,
    name: '流程图',
    icon: shallowRef(IconBranch),
    lock: FileLct
  }];
export const extraNoteTypes: Array<ArticleTypeList> = [
  {
    key: ArticleTypeEnum.ENCRYPT_EDITOR,
    name: '加密笔记',
    icon: shallowRef(LockOnIcon),
    lock: FileEncrypt,
    vip: true
  }
]

export const articleTypes: Array<ArticleTypeList> = [
  ...mainNoteTypes,
  ...extraNoteTypes
]
export const articleTypeMap = map(articleTypes, 'key');

export function buildArticleIcon(type: ArticleTypeEnum, readonly = false) {
  const icon = articleTypeMap.get(type);
  return h(icon ? (readonly ? icon.lock : icon.icon.value) : IconFile, {})
}

export function renderArticleType(type: ArticleTypeEnum): string {
  for (let articleType of articleTypes) {
    if (articleType.key === type) {
      return articleType.name;
    }
  }
  return "未知类型";
}

export async function buildDefaultContent(name: string, type: ArticleTypeEnum): Promise<any> {
  switch (type) {
    case ArticleTypeEnum.MIND_MAP:
      return buildMindMapData()
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
      // 查看是否有模板
      const {markdownTemplates} = usePluginSettingStore();
      for (let markdownTemplate of markdownTemplates) {
        // 名字匹配
        if (name.match(markdownTemplate.name)) {
          // 获取内容
          const {getContent} = usePluginSettingStore();
          const res = await getContent(markdownTemplate.id);
          return res.record ? res.record?.content : '';
        }
      }
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

export function addArticleModal() {
  const {newArticleAutoName, newArticleTemplateByName, codeExtraName} = useBaseSettingStore();
  const type = ref(ArticleTypeEnum.MARKDOWN);
  const folder = ref(0);
  const name = ref('');
  const {folderTree} = useFolderStore();

  function refreshFileName() {
    name.value = buildArticleName(ArticleTypeEnum.MARKDOWN, newArticleTemplateByName, codeExtraName, folder.value);
  }

  // 如果自动命名，则刷新
  if (newArticleAutoName) {
    refreshFileName();
  }

  const plugin = DialogPlugin({
    header: '新增笔记',
    placement: 'center',
    draggable: true,
    confirmBtn: '新增',
    default: () => <Form data={{}} layout={'vertical'}>
      <FormItem label={'笔记类型'} status={'validating'} labelAlign={'top'}>
        <RadioGroup v-model={type.value}>
          {articleTypes.map(item => <Radio key={item.key} value={item.key}>{item.name}</Radio>)}
        </RadioGroup>
      </FormItem>
      <FormItem label={'所在文件夹'} labelAlign={'top'}>
        <TreeSelect data={folderTree} v-model={folder.value} placeholder={'请选择所在文件夹'}/>
      </FormItem>
      <FormItem label={'笔记名称'} labelAlign={'top'}>
        <Input v-model={name.value} class={'arco-input'} placeholder={'请输入笔记名称'} clearable={true}>
          {{
            suffix: () =>
              <Button variant={'text'} theme={'primary'} shape={'square'} onClick={refreshFileName}>
                {{
                  icon: () => <IconRefresh/>
                }}
              </Button>
          }}
        </Input>
      </FormItem>
    </Form>,
    async onConfirm() {
      if (name.value.trim() === '') {
        MessageUtil.warning("请输入笔记名称")
        return Promise.resolve(false);
      }
      const article = await addNote({
        pid: folder.value,
        type: type.value,
        name: name.value
      })
      useHomeEditorStore().openArticle(article);
      plugin.destroy();
      return Promise.resolve(true);
    }
  })
}

/**
 * 新增一个文件夹
 * @param pid 文件夹父ID
 */
export function addFolder(pid: number) {
  useUmami.track('/新建/文件夹')
  MessageBoxUtil.prompt("请输入文件夹名称", "新建文件夹", {
    confirmButtonText: "新增",
    cancelButtonText: "取消"
  }).then(name => {
    useFolderStore().addFolder(pid, name)
      .then(() => MessageUtil.success("新增成功"))
      .catch(e => MessageUtil.error("新增失败", e));
  })
}

/**
 * 删除一个笔记或文件夹
 * @param id 笔记或文件夹ID
 * @param name 笔记或文件夹名
 * @param article 是否是笔记
 */
export function remove(id: number, name: string, article: boolean) {
  if (article) {
    MessageBoxUtil.confirm(`确认删除笔记【${name}】？`, "删除提示", {
      confirmButtonText: "删除",
    }).then(() => _remove(id, article)
      .then(() => MessageUtil.success("删除成功"))
      .catch(e => MessageUtil.error("删除失败", e)))
  } else {
    MessageBoxUtil.confirmMulti(`确认删除文件夹【${name}】？`, "删除提示", [{
      name: '删除文件夹及全部文件',
      action: () => {
        Promise.all([useFolderStore().removeFolder(id), useArticleStore().removeFolder(id)])
          .then(() => MessageUtil.success("删除文件夹及全部文件成功"))
          .catch(e => MessageUtil.error("删除文件夹及全部文件失败", e))
      }
    }, {
      name: '只删除文件夹',
      action: () => {

        useFolderStore().removeFolder(id)
          .then(() => MessageUtil.success("只删除文件夹成功"))
          .catch(e => MessageUtil.error("只删除文件夹失败", e))
      }
    }]).finally(() => console.debug("删除完成"))
  }
}

async function _remove(id: number, article: boolean) {
  if (article) {
    await useArticleStore().removeById(id)
  } else {
    // 删除文件夹
    await useFolderStore().removeFolder(id)
  }
}

/**
 * 重命名一个笔记或文件夹
 * @param id 笔记或文件夹ID
 * @param name 笔记或文件夹名
 * @param article 是否是笔记
 */
export function rename(id: number, name: string, article: boolean) {
  MessageBoxUtil.prompt(`请输入新的文件${article ? '' : '夹'}名称`, "重命名", {
    confirmButtonText: "确认",
    inputValue: name
  }).then(newName => {
    if (article) {
      // 重命名文件
      useArticleStore().updateIndex(id, {name: newName})
        .then(res => {
          MessageUtil.success("重命名成功");
          useHomeEditorStore().update(id, res);
        })
        .catch(e => MessageUtil.error("重命名失败", e));
    } else {
      useFolderStore().renameFolder(id, newName)
        .then(() => MessageUtil.success("重命名成功"))
        .catch(e => MessageUtil.error("重命名失败", e));
    }
  })
}