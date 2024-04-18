import {
    Alert,
    Button,
    Input,
    InputGroup,
    Link,
    List,
    ListItem,
    ListItemMeta,
    Modal
} from "@arco-design/web-vue";
import {ref} from "vue";
import {useWindowSize} from "@vueuse/core";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {IconClose, IconSearch} from "@arco-design/web-vue/es/icon";


interface Item {
    title: string;
    html: string;
    value: number
}

export function openSearchContent() {

    const size = useWindowSize();

    const keyword = ref('');
    const loading = ref(false);
    const close = ref(false);
    const text = ref('');
    const items = ref(new Array<Item>());


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
        _searchContent()
            .then(() => MessageUtil.success("搜索完成"))
            .catch(e => MessageUtil.error("搜索失败", e))
            .finally(() => loading.value = false);

    }

    async function _searchContent() {
        const articles = useArticleStore().articles.filter(a =>
            (a.type === ArticleTypeEnum.RICH_TEXT || a.type === ArticleTypeEnum.MARKDOWN || a.type === ArticleTypeEnum.CODE));
        for (let i = 0; i < articles.length; i++) {
            if (close.value) {
                return Promise.resolve();
            }
            text.value = `正在搜索 ${i + 1} / ${articles.length}`
            const article = articles[i];
            const contentWrap = await getFromOneWithDefaultByAsync<ArticleContent<any>>(
                LocalNameEnum.ARTICLE_CONTENT + article.id, {content: ''});
            // 搜索
            let content = contentWrap.record.content;
            if (typeof content !== 'string') {
                continue;
            }
            if (article.type === ArticleTypeEnum.RICH_TEXT) {
                const parser = new DOMParser();
                const document = parser.parseFromString(content, 'text/html');
                content = document.body.innerText;
            }
            const length = content.length;
            const index = content.indexOf(keyword.value);
            if (index > -1) {
                const prefix = content.substring(Math.max(0, index - 30), index);
                const key = content.substring(index, Math.min(length, index + keyword.value.length));
                const suffix = content.substring(Math.max(0, index + keyword.value.length),
                    Math.min(length, index + keyword.value.length + 80));
                items.value.push({
                    html: `${prefix}<mark class="keyword">${key}</mark>${suffix}`,
                    title: article.name,
                    value: article.id
                });
            }
        }

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
        title: () => <InputGroup style={{width: '80%'}}>
            <Input v-model={keyword.value} placeholder={'请输入文章内容，仅支持markdown、富文本和代码笔记搜索'}
                   onPressEnter={searchContent} allowClear={true}/>
            <Button type={'primary'} disabled={keyword.value.trim() === ''} onClick={searchContent}>
                {{
                    icon: () => <IconSearch/>
                }}
            </Button>
            <Button type={'primary'} status={'danger'} disabled={!loading.value} onClick={stop}>
                {{
                    icon: () => <IconClose/>
                }}
            </Button>
        </InputGroup>,
        titleAlign: 'start',
        width: '80%',
        footer: false,
        content: () => <div style={{height: (size.height.value - 250) + 'px'}}>
            {loading.value && <Alert>{text.value}</Alert>}
            <List bordered={false}>
                {items.value.map(item => <ListItem>
                    <ListItemMeta>
                        {{
                            title: () => <Link onClick={() => toArticle(item.value)}>{item.title}</Link>,
                            description: () => <div innerHTML={item.html}></div>
                        }}
                    </ListItemMeta>
                </ListItem>)}
            </List>
        </div>
    });
}
