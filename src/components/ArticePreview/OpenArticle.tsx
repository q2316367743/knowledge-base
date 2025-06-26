import {Button, DrawerPlugin, Space} from "tdesign-vue-next";
import {ArticleActionEnum} from "@/entity/setting/BaseSetting";
import {useArticleStore, useBaseSettingStore, useHomeEditorStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Edit2Icon, ChevronLeftSIcon} from 'tdesign-icons-vue-next';
import {usePageJumpEvent} from "@/global/BeanFactory";
import {ArticleIndex} from "@/entity/article";
import {openNotePreview} from "@/widget/NotePreview";
import EditorContentContainer
  from "@/pages/note/layout/editor-content/layout/EditorContentEditor/EditorContentEditor.vue";


function _openArticle(articleIndex: ArticleIndex, width = '80vw') {
  const dp = DrawerPlugin({
    header: () => <div>
      <Button theme={'primary'} variant={'text'} shape={'square'} onClick={openToArticle}>
        {{
          icon: () => <Edit2Icon/>
        }}
      </Button>
      <span style={{marginLeft: '7px'}}>{articleIndex.name}</span>
    </div>,
    size: width,
    footer: false,
    closeBtn: false,
    default: () => <div style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0'}}>
      <EditorContentContainer articleIndex={{
        ...articleIndex,
        preview: true
      }}/>
    </div>
  });

  function openToArticle() {
    useHomeEditorStore().openArticle(articleIndex.id);
    usePageJumpEvent.emit('/note');
    dp.destroy?.();
  }
}

/**
 * 前往笔记
 * @param id
 * @param articleAction
 */
function toArticle(id: number, articleAction: ArticleActionEnum) {
  if (articleAction === ArticleActionEnum.TO_ARTICLE) {
    useHomeEditorStore().openArticle(id);
    usePageJumpEvent.emit('/note');
  } else if (articleAction === ArticleActionEnum.DRAWER) {
    const article = useArticleStore().articleMap.get(id);
    if (!article) {
      MessageUtil.error("笔记不存在");
      return;
    }
    _openArticle(article);
  } else if (articleAction === ArticleActionEnum.WIDGET) {
    openNotePreview(id)
  }
}

export function toArticleByTodo(id: number) {
  toArticle(id, useBaseSettingStore().todoArticleAction);
}

export function toArticleByRelation(idOrTitle: number | string) {
  let id: number | null = null;
  if (typeof idOrTitle === "string") {
    for (let article of useArticleStore().articles) {
      if (article.name === idOrTitle) {
        id = article.id;
        break;
      }
    }
  }else {
    id = idOrTitle;
  }
  if (!id) {
    MessageUtil.warning(`笔记【${idOrTitle}】不存在`)
    return;
  }
  // 查询笔记
  toArticle(id, useBaseSettingStore().todoArticleAction);
}


export function openArticle(id: number) {
  const article = useArticleStore().articleMap.get(id);
  if (!article) {
    MessageUtil.error("笔记不存在");
    return;
  }
  const open = DrawerPlugin({
      header: () => <Space>
        <Button shape={'circle'} theme={'primary'} variant={'text'} onClick={() => open.destroy?.()}>{{
          icon: () => <ChevronLeftSIcon/>
        }}</Button>
        <span class="arco-page-header-title">{article.name}</span>
      </Space>,
      size: '100%',
      footer: false,
      closeBtn: false,
      default:
        () => <div style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0'}}>
          <EditorContentContainer articleIndex={{
            ...article,
            preview: true
          }}/>
        </div>
    })
  ;
}
