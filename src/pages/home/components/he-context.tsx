import {useUmami} from "@/plugin/umami";
import {h, ref, shallowRef} from "vue";
import {
  IconBook,
  IconBranch,
  IconCode,
  IconFile,
  IconMindMapping,
  IconNav,
  IconRefresh
} from "@arco-design/web-vue/es/icon";
import {Button, Form, FormItem, Input, Modal, Radio, RadioGroup, TreeSelect} from "@arco-design/web-vue";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
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
import {MindMapTreeNode} from "@/editor/MindMapEditor/domain";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
// 图标
import FileMarkdown from '@/components/KbIcon/FileMarkdown.vue';
import IconRichText from '@/components/KbIcon/FileRichText.vue';
import FileCode from '@/components/KbIcon/FileCode.vue';
import FileMindMap from '@/components/KbIcon/FileMindMap.vue';
import FileHandsontable from '@/components/KbIcon/FileHandsontable.vue';
import FileLct from "@/components/KbIcon/FileLct.vue";

// ------------------------------------------------------------------------------------------------------
// ----------------------------------------------- 全局配置 -----------------------------------------------
// ------------------------------------------------------------------------------------------------------

export const articleTextTypes = [{
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

export const articleTypes = [
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
const articleTypeMap = map(articleTypes, 'key');

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

async function buildDefaultContent(name: string, type: ArticleTypeEnum): Promise<any> {
  switch (type) {
    case ArticleTypeEnum.MIND_MAP:
      return {
        "layout": "logicalStructure",
        "root": {
          "data": {
            "text": "根节点",
            "expand": true,
            "isActive": false,
            "uid": "47fe79a5-2690-4343-8fbf-74c350d4b92f",
            richText: false,
          }, "children": []
        } as MindMapTreeNode,
        "theme": {"template": 'default', "config": {}},
        "view": {
          "transform": {
            "scaleX": 1,
            "scaleY": 1,
            "shear": 0,
            "rotate": 0,
            "translateX": 0,
            "translateY": 0,
            "originX": 0,
            "originY": 0,
            "a": 1,
            "b": 0,
            "c": 0,
            "d": 1,
            "e": 0,
            "f": 0
          },
          "state": {"scale": 1, "x": 0, "y": 0, "sx": 0, "sy": 0}
        }
      }
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
      return {
        data: {
          "nodes": [
            {
              "id": "387d7ca1-a582-4e2e-bf51-a056dbd70783",
              "type": "pro-rect",
              "x": 36,
              "y": 89,
              "properties": {
                "backgroundColor": "#ffffff",
                "borderType": 0,
                "borderColor": "",
                "borderWidth": 2,
                "borderStyle": "solid",
                "fontSize": 12,
                "fontColor": "#000000",
                "fontWeight": "",
                "fontFamily": "",
                "lineHeight": "1",
                "textAlign": "center",
                "fontStyle": "",
                "textDecoration": ""
              },
              "text": {
                "x": 36,
                "y": 89,
                "value": "你好"
              }
            },
            {
              "id": "3f32b304-4e84-4fe4-9375-48e3ada0c80b",
              "type": "pro-circle",
              "x": 296,
              "y": 89,
              "properties": {}
            }
          ],
          "edges": [
            {
              "id": "3992994d-0ce9-456a-8bd0-e2ae3db4c0ac",
              "type": "pro-polyline",
              "properties": {},
              "sourceNodeId": "387d7ca1-a582-4e2e-bf51-a056dbd70783",
              "targetNodeId": "3f32b304-4e84-4fe4-9375-48e3ada0c80b",
              "startPoint": {
                "x": 86,
                "y": 89
              },
              "endPoint": {
                "x": 246,
                "y": 89
              },
              "pointsList": [
                {
                  "x": 86,
                  "y": 89
                },
                {
                  "x": 246,
                  "y": 89
                }
              ]
            }
          ]
        },
        option: {
          miniMap: true,
          grid: 'empty',
          gridSize: 0,
          gridVisible: false,
          gridConfigColor: '#000000',
          gridConfigThickness: 1
        },
        editConfig: {
          stopZoomGraph: false,
          stopScrollGraph: false,
          stopMoveGraph: false,
          adjustEdge: true,
          adjustEdgeMiddle: false,
          adjustEdgeStartAndEnd: false,
          adjustNodePosition: true,
          hideAnchors: false,
          hoverOutline: true,
          nodeSelectedOutline: true,
          edgeSelectedOutline: true,
          nodeTextEdit: true,
          edgeTextEdit: true,
          textEdit: true,
          nodeTextDraggable: false,
          edgeTextDraggable: false,
          autoExpand: true
        }
      }
    default:
      return "";
  }
}

/**
 * 新增一篇文章
 * @param pid 父ID
 * @param type 文章类型
 */
export function addArticle(pid: number, type: ArticleTypeEnum) {
  _addArticle(pid, type).then(article => {
    MessageUtil.success("新增成功");
    useHomeEditorStore().openArticle(article);
    // 新建文章
    useUmami.track(`/新建/文章/${renderArticleType(type)}`);
  })
    .catch(e => MessageUtil.error("新增失败", e));
}

export async function _addArticle(pid: number, type: ArticleTypeEnum, content?: string) {
  const {newArticleAutoName, newArticleTemplateByName, codeExtraName} = useBaseSettingStore();
  let name: string;
  if (newArticleAutoName) {
    name = buildArticleName(type, newArticleTemplateByName, codeExtraName, pid);
  } else {
    name = await MessageBoxUtil.prompt("请输入文章名称", "新建文章");
  }
  if (!content) {
    content = await buildDefaultContent(name, type);
  }

  return useArticleStore().add(getDefaultArticleIndex({
    name,
    folder: pid,
    type,
  }), getDefaultArticleBase(), content);
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

  Modal.open({
    title: '新增文章',
    titleAlign: 'start',
    draggable: true,
    okText: '新增',
    content: () => <Form model={{}} layout={'vertical'}>
      <FormItem label={'文章类型'} required>
        <RadioGroup v-model={type.value}>
          {articleTypes.map(item => <Radio key={item.key} value={item.key}>{item.name}</Radio>)}
        </RadioGroup>
      </FormItem>
      <FormItem label={'所在文件夹'} required>
        <TreeSelect data={folderTree} v-model={folder.value} placeholder={'请选择所在文件夹'}/>
      </FormItem>
      <FormItem label={'文章名称'} required>
        <Input v-model={name.value} class={'arco-input'} placeholder={'请输入文章名称'} allowClear>
          {{
            suffix: () => newArticleAutoName && <Button type={'text'} onClick={refreshFileName}>
              {{
                icon: () => <IconRefresh/>
              }}
            </Button>
          }}
        </Input>
      </FormItem>
    </Form>,
    async onBeforeOk() {
      if (name.value.trim() === '') {
        MessageUtil.warning("请输入文章名称")
        return Promise.resolve(false);
      }
      const content = buildDefaultContent(name.value, type.value);
      const article = await useArticleStore().add(getDefaultArticleIndex({
        name: name.value,
        folder: folder.value,
        type: type.value,
      }), getDefaultArticleBase(), content);
      useHomeEditorStore().openArticle(article);
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
 * 删除一个文章或文件夹
 * @param id 文章或文件夹ID
 * @param name 文章或文件夹名
 * @param article 是否是文章
 */
export function remove(id: number, name: string, article: boolean) {
  if (article) {
    MessageBoxUtil.confirm(`确认删除文章【${name}】？`, "删除提示", {
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
 * 重命名一个文章或文件夹
 * @param id 文章或文件夹ID
 * @param name 文章或文件夹名
 * @param article 是否是文章
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

export function setColor(id: number) {
  // TODO:  设置颜色
}