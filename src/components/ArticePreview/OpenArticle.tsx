import {Drawer} from "@arco-design/web-vue";
import {Button, Space} from "tdesign-vue-next";
import {ArticleActionEnum} from "@/entity/setting/BaseSetting";
import {useArticleStore, useBaseSettingStore, useHomeEditorStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Edit2Icon, ChevronLeftSIcon} from 'tdesign-icons-vue-next';
import {usePageJumpEvent} from "@/global/BeanFactory";
import {ArticleIndex} from "@/entity/article";
import EditorContentContainer
  from "@/pages/note/layout/editor-content/layout/EditorContentEditor/EditorContentEditor.vue";
import {openNotePreview} from "@/widget/NotePreview";


function _openArticle(articleIndex: ArticleIndex, width = '80vw') {
  const size = useWindowSize();

  function openToArticle() {
    useHomeEditorStore().openArticle(articleIndex.id);
    usePageJumpEvent.emit('/note');
    open.close();
  }

  const open = Drawer.open({
    title: () => <div>
      <Button theme={'primary'} variant={'text'} shape={'square'} onClick={openToArticle}>
        {{
          icon: () => <Edit2Icon/>
        }}
      </Button>
      <span style={{marginLeft: '7px'}}>{articleIndex.name}</span>
    </div>,
    width: width,
    footer: false,
    closable: false,
    content: () => <div style={{height: (size.height.value - 72) + 'px', width: '100%'}}>
      <EditorContentContainer articleIndex={{
        ...articleIndex,
        preview: true
      }}/>
    </div>
  });
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

export function toArticleByRelation(title: string) {
  let id: number | null = null;
  for (let article of useArticleStore().articles) {
    if (article.name === title) {
      id = article.id;
      break;
    }
  }
  if (!id) {
    MessageUtil.warning(`笔记【${title}】不存在`)
    return;
  }
  // 查询笔记
  toArticle(id, useBaseSettingStore().relationArticleAction);
}


export function openArticle(id: number) {
  const article = useArticleStore().articleMap.get(id);
  if (!article) {
    MessageUtil.error("笔记不存在");
    return;
  }
  const size = useWindowSize();


  const open = Drawer.open({
      title: () => <Space>
        <Button shape={'circle'} theme={'primary'} variant={'text'} onClick={open.close}>{{
          icon: () => <ChevronLeftSIcon/>
        }}</Button>
        <span class="arco-page-header-title">{article.name}</span>
      </Space>,
      width: '100%',
      footer:
        false,
      closable:
        false,
      content:
        () => <div style={{height: (size.height.value - 72) + 'px', width: '100%'}}>
          <EditorContentContainer articleIndex={{
            ...article,
            preview: true
          }}/>
        </div>
    })
  ;
}
