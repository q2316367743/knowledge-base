import {useUmami} from "@/plugin/umami";
import {
    Alert,
    Button, Col,
    Input,
    Link,
    List,
    ListItem,
    ListItemMeta,
    Modal, Option, Row, Select, Tag
} from "@arco-design/web-vue";
import {Ref, ref} from "vue";
import {useWindowSize} from "@vueuse/core";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleTypeEnum, TEXT_TYPE_LIST} from "@/enumeration/ArticleTypeEnum";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {IconClose, IconEdit, IconSearch} from "@arco-design/web-vue/es/icon";
import {findKeyword, MindMapTreeNode} from "@/editor/MindMapEditor/domain";
import {articleTextTypes, renderArticleType} from "@/pages/home/components/he-context";
import {openArticle} from "@/components/ArticePreview/OpenArticle";


export interface SearchContentItem {
    title: string;
    html: string;
    value: number;
    type: ArticleTypeEnum
}

export async function _searchContent(
    keyword: string,
    close: Ref<boolean>,
    items: Ref<Array<SearchContentItem>>,
    text: Ref<string>,
    type: ArticleTypeEnum | 0
): Promise<void> {
    const articles = useArticleStore().articles
      .filter(a => {
        if (a.isDelete) {
          // 排除已删除的
          return false;
        }
        return type === 0 ? TEXT_TYPE_LIST.includes(a.type) : (a.type === type)
      });
    for (let i = 0; i < articles.length; i++) {
        if (close.value) {
            return Promise.resolve();
        }
        const article = articles[i];
        text.value = `正在搜索 ${i + 1} / ${articles.length}：${article.name}`;
        const contentWrap = await getFromOneWithDefaultByAsync<ArticleContent<any>>(
            LocalNameEnum.ARTICLE_CONTENT + article.id, {content: ''});
        // 搜索
        let content = contentWrap.record.content;
        if (article.type === ArticleTypeEnum.MIND_MAP) {
            if (typeof content === 'string') {
                continue;
            }
            const root = content['root'] as MindMapTreeNode;
            if (root) {
                const results = findKeyword(keyword, root);
                if (results && results.length > 0) {
                    results.forEach((item) => {
                        items.value.push({
                            html: item,
                            title: article.name,
                            value: article.id,
                            type: article.type
                        });
                    })
                }
            }
        } else {
            if (typeof content !== 'string') {
                continue;
            }
            if (article.type === ArticleTypeEnum.RICH_TEXT) {
                const parser = new DOMParser();
                const document = parser.parseFromString(content, 'text/html');
                content = document.body.innerText;
            }
            const length = content.length;
            let position = 0;
            while (position < length) {
                const index = content.indexOf(keyword, position);
                if (index > -1) {
                    const prefix = content.substring(Math.max(0, index - 30), index);
                    const key = content.substring(index, Math.min(length, index + keyword.length));
                    const suffix = content.substring(Math.max(0, index + keyword.length),
                        Math.min(length, index + keyword.length + 80));
                    items.value.push({
                        html: `${prefix}<mark class="keyword">${key}</mark>${suffix}`,
                        title: article.name,
                        value: article.id,
                        type: article.type
                    });
                    position = index + keyword.length;
                    continue;
                }
                break;
            }
        }
    }

}

export const SearchContentPlaceholder: string = "请输入文章内容，支持markdown、富文本、代码笔记和思维导图搜索";

export function openSearchContent() {

    useUmami.track("使用全局搜索");

    const size = useWindowSize();

    const keyword = ref('');
    const loading = ref(false);
    const close = ref(false);
    const text = ref('');
    const items = ref(new Array<SearchContentItem>());
    const type = ref<ArticleTypeEnum | 0>(0)


    function searchContent() {
        loading.value = true;
        close.value = false;
        text.value = '';
        items.value = [];
        if (keyword.value.trim() === '') {
            loading.value = false;
            close.value = true;
            return;
        }
        _searchContent(keyword.value, close, items, text, type.value)
            .then(() => MessageUtil.success("搜索完成"))
            .catch(e => MessageUtil.error("搜索失败", e))
            .finally(() => loading.value = false);

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
        title: () => <Row gutter={8} style={{width: '80%'}}>
            <Col flex={'120px'}>
                <Select v-model={type.value}>
                    <Option value={0}>全部</Option>
                    {articleTextTypes.map(articleType => <Option value={articleType.key}>{articleType.name}</Option>)}
                </Select>
            </Col>
            <Col flex={'auto'}>
                <Input v-model={keyword.value} placeholder={SearchContentPlaceholder}
                       onPressEnter={searchContent} allowClear={true} onVnodeMounted={e => {
                    const htmlInputElement = (e.el as HTMLSpanElement).querySelector('input');
                    htmlInputElement && htmlInputElement.focus();
                }}/>
            </Col>
            <Col flex={'32px'}>
                <Button type={'primary'} disabled={keyword.value.trim() === ''} onClick={searchContent}>
                    {{
                        icon: () => <IconSearch/>
                    }}
                </Button>
            </Col>
            <Col flex={'32px'}>
                <Button type={'primary'} status={'danger'} disabled={!loading.value} onClick={stop}>
                    {{
                        icon: () => <IconClose/>
                    }}
                </Button>
            </Col>
        </Row>,
        titleAlign: 'start',
        width: '80%',
        footer: false,
        content: () => <div style={{height: (size.height.value - 250) + 'px'}}>
            {loading.value && <Alert>{text.value}</Alert>}
            <List bordered={false}>
                {items.value.map(item => <ListItem>{{
                    default: () => <ListItemMeta>
                        {{
                            title: () => <>
                                <Tag color={'blue'}>{renderArticleType(item.type)}</Tag>
                                <Link onClick={() => openArticle(item.value)}>{item.title}</Link>
                            </>,
                            description: () => <div innerHTML={item.html}></div>
                        }}
                    </ListItemMeta>,
                    actions: () => <Button type={'text'} onClick={() => toArticle(item.value)}>{{
                        icon: () => <IconEdit/>
                    }}</Button>
                }}</ListItem>)}
            </List>
        </div>
    });
}
