import {ArticleIndex} from "@/entity/article";
import {Button, Drawer} from "@arco-design/web-vue";
import EditorContentContainer from "@/pages/home/layout/editor-content/layout/EditorContentContainer/EditorContentEditor.vue";
import {useWindowSize} from "@vueuse/core";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {ArticleActionEnum} from "@/entity/setting/BaseSetting";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {IconEdit} from "@arco-design/web-vue/es/icon";
import {usePageJumpEvent} from "@/global/BeanFactory";


export function toArticleByTodo(id: number) {
    toArticle(id, useBaseSettingStore().todoArticleAction);
}

export function toArticleByRelation(title: string) {
    let id: number | null = null;
    for (let article of useArticleStore().articles) {
        if (article.name === title) {
            id = article.id;
            break;
        }
    }
    if (!id) {
        MessageUtil.warning(`文章【${title}】不存在`)
        return;
    }
    // 查询文章
    toArticle(id, useBaseSettingStore().relationArticleAction);
}


/**
 * 前往文章
 * @param id
 * @param articleAction
 */
function toArticle(id: number, articleAction: ArticleActionEnum) {
    if (articleAction === ArticleActionEnum.TO_ARTICLE) {
        useHomeEditorStore().openArticle(id);
        usePageJumpEvent.emit('/home');
    } else if (articleAction === ArticleActionEnum.DRAWER) {
        const article = useArticleStore().articleMap.get(id);
        if (!article) {
            MessageUtil.error("文章不存在");
            return;
        }
        openArticle(article);
    }
}

function openArticle(articleIndex: ArticleIndex) {
    const size = useWindowSize();

    function openToArticle() {
        useHomeEditorStore().openArticle(articleIndex.id);
        usePageJumpEvent.emit('/home');
        open.close();
    }

    const open = Drawer.open({
        title: () => <div>
            <Button type={'text'} onClick={openToArticle}>
                {{
                    icon: () => <IconEdit />
                }}
            </Button>
            <span style={{marginLeft: '7px'}}>articleIndex.name</span>
        </div>,
        width: '80vw',
        footer: false,
        closable:false,
        content: () => <div style={{height: (size.height.value - 72) + 'px', width: '100%'}}>
            <EditorContentContainer articleIndex={{
                ...articleIndex,
                preview: true
            }}/>
        </div>
    });
}
