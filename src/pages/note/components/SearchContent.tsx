import { useUmami } from "@/plugin/umami";
import {
  Alert,
  Button,
  Col,
  Input,
  Link,
  List,
  ListItem,
  ListItemMeta,
  Modal,
  Option,
  Row,
  Select,
  Tag,
} from "@arco-design/web-vue";
import { Ref, ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import MessageUtil from "@/utils/modal/MessageUtil";
import { useArticleStore } from "@/store/db/ArticleStore";
import { ArticleTypeEnum, TEXT_TYPE_LIST } from "@/enumeration/ArticleTypeEnum";
import { getFromOneWithDefaultByAsync } from "@/utils/utools/DbStorageUtil";
import { ArticleContent } from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { useHomeEditorStore } from "@/store/components/HomeEditorStore";
import { IconClose, IconEdit, IconSearch } from "@arco-design/web-vue/es/icon";
import { findKeyword, MindMapTreeNode } from "@/editor/MindMapEditor/domain";
import {
  articleTextTypes,
  renderArticleType,
} from "@/pages/note/components/he-context";
import { openArticle } from "@/components/ArticePreview/OpenArticle";

export interface SearchContentItem {
  title: string;
  html: string;
  value: number;
  type: ArticleTypeEnum;
}
export interface SearchContentOption {
  ignoreCase?: boolean;
  wholeWord?: boolean;
  useRegex?: boolean;
}

export async function _searchContent(
  keyword: string,
  close: Ref<boolean>,
  items: Ref<Array<SearchContentItem>>,
  text: Ref<string>,
  type: ArticleTypeEnum | 0,
  options?: SearchContentOption
): Promise<void> {
  const articles = useArticleStore().articles.filter((a) => {
    if (a.isDelete) {
      return false;
    }
    return type === 0 ? TEXT_TYPE_LIST.includes(a.type) : a.type === type;
  });
  // 准备搜索参数
  let searchRegex: RegExp;
  if (options?.useRegex) {
    try {
      searchRegex = new RegExp(keyword, options.ignoreCase ? "gi" : "g");
    } catch (e) {
      return Promise.reject("无效的正则表达式");
    }
  } else {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = options?.wholeWord
      ? `\\b${escapedKeyword}\\b`
      : escapedKeyword;
    searchRegex = new RegExp(pattern, options?.ignoreCase ? "gi" : "g");
  }
  for (let i = 0; i < articles.length; i++) {
    if (close.value) {
      return Promise.resolve();
    }
    const article = articles[i];
    text.value = `正在搜索 ${i + 1} / ${articles.length}：${article.name}`;
    const contentWrap = await useArticleStore().getContent<any>(article.id);

    let content = contentWrap.record?.content || {};
    if (article.type === ArticleTypeEnum.MIND_MAP) {
      if (typeof content === "string") {
        continue;
      }
      const root = content["root"] as MindMapTreeNode;
      if (root) {
        const results = findKeyword(keyword, root, options);
        if (results && results.length > 0) {
          results.forEach((item) => {
            items.value.push({
              html: item,
              title: article.name,
              value: article.id,
              type: article.type,
            });
          });
        }
      }
    } else {
      if (typeof content !== "string") {
        continue;
      }
      if (article.type === ArticleTypeEnum.RICH_TEXT) {
        const parser = new DOMParser();
        const document = parser.parseFromString(content, "text/html");
        content = document.body.innerText;
      }

      let match;
      while ((match = searchRegex.exec(content)) !== null) {
        const index = match.index;
        const matchedText = match[0];
        const prefix = content.substring(Math.max(0, index - 30), index);
        const suffix = content.substring(
          index + matchedText.length,
          Math.min(content.length, index + matchedText.length + 80)
        );

        items.value.push({
          html: `${prefix}<mark class="keyword">${matchedText}</mark>${suffix}`,
          title: article.name,
          value: article.id,
          type: article.type,
        });
      }
    }
  }
}

export const SearchContentPlaceholder: string =
  "请输入笔记内容，支持markdown、富文本、代码笔记和思维导图搜索";

export function openSearchContent() {
  useUmami.track("使用全局搜索");

  const size = useWindowSize();

  const keyword = ref("");
  const loading = ref(false);
  const close = ref(false);
  const text = ref("");
  const items = ref(new Array<SearchContentItem>());
  const type = ref<ArticleTypeEnum | 0>(0);

  function searchContent() {
    loading.value = true;
    close.value = false;
    text.value = "";
    items.value = [];
    if (keyword.value.trim() === "") {
      loading.value = false;
      close.value = true;
      return;
    }
    _searchContent(keyword.value, close, items, text, type.value)
      .then(() => MessageUtil.success("搜索完成"))
      .catch((e) => MessageUtil.error("搜索失败", e))
      .finally(() => (loading.value = false));
  }

  function stop() {
    if (close.value) {
      MessageUtil.warning("正在停止中，请勿重复操作");
      return;
    }
    close.value = true;
  }

  function toArticle(id: number) {
    useHomeEditorStore().openArticle(id);
    modalReturn.close();
  }

  const modalReturn = Modal.open({
    title: () => (
      <Row gutter={8} style={{ width: "80%" }}>
        <Col flex={"120px"}>
          <Select v-model={type.value}>
            <Option value={0}>全部</Option>
            {articleTextTypes.map((articleType) => (
              <Option value={articleType.key}>{articleType.name}</Option>
            ))}
          </Select>
        </Col>
        <Col flex={"auto"}>
          <Input
            v-model={keyword.value}
            placeholder={SearchContentPlaceholder}
            onPressEnter={searchContent}
            allowClear={true}
            onVnodeMounted={(e) => {
              const htmlInputElement = (e.el as HTMLSpanElement).querySelector(
                "input"
              );
              htmlInputElement && htmlInputElement.focus();
            }}
          />
        </Col>
        <Col flex={"32px"}>
          <Button
            type={"primary"}
            disabled={keyword.value.trim() === ""}
            onClick={searchContent}
          >
            {{
              icon: () => <IconSearch />,
            }}
          </Button>
        </Col>
        <Col flex={"32px"}>
          <Button
            type={"primary"}
            status={"danger"}
            disabled={!loading.value}
            onClick={stop}
          >
            {{
              icon: () => <IconClose />,
            }}
          </Button>
        </Col>
      </Row>
    ),
    titleAlign: "start",
    width: "80%",
    footer: false,
    content: () => (
      <div style={{ height: size.height.value - 250 + "px" }}>
        {loading.value && <Alert>{text.value}</Alert>}
        <List bordered={false}>
          {items.value.map((item) => (
            <ListItem>
              {{
                default: () => (
                  <ListItemMeta>
                    {{
                      title: () => (
                        <>
                          <Tag color={"blue"}>
                            {renderArticleType(item.type)}
                          </Tag>
                          <Link onClick={() => openArticle(item.value)}>
                            {item.title}
                          </Link>
                        </>
                      ),
                      description: () => <div innerHTML={item.html}></div>,
                    }}
                  </ListItemMeta>
                ),
                actions: () => (
                  <Button type={"text"} onClick={() => toArticle(item.value)}>
                    {{
                      icon: () => <IconEdit />,
                    }}
                  </Button>
                ),
              }}
            </ListItem>
          ))}
        </List>
      </div>
    ),
  });
}
