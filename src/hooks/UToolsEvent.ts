import {useUmami} from "@/plugin/umami";
import {addSimpleNote} from "@/utils/component/AddNoteUtil";
import {useArticleStore, useHomeEditorStore, useTodoWrapStore} from "@/store";
import router from '@/plugin/router';
import {InjectionUtil, MainPushCallback, MainPushSelectCallback} from "@/utils/utools/InjectionUtil";
import {ArticleIndex} from "@/entity/article";
import {keyword} from "@/global/BeanFactory";
import {openNotePreview} from "@/widget/NotePreview";


function toArticle(id?: string) {
  if (!id) {
    return;
  }
  useHomeEditorStore().openArticle(parseInt(id || '0'));
  router.push('/note');
}

function toTodo(id?: string) {
  const categoryId = parseInt(id || '0');
  useTodoWrapStore().init(categoryId);
  useTodoWrapStore().setItemId(categoryId);
  router.push('/todo');
}


export function usePluginEnter(operate: string, preload: string, extra: string) {
  if (operate === 'note') {
    useUmami.track("feature", "查看笔记");
    openNotePreview(Number(preload));
    InjectionUtil.window.hideMainWindow();
    InjectionUtil.window.outPlugin();
  } else if (operate === 'todo') {
    useUmami.track("feature", "查看待办");
    toTodo(preload);
  } else if (operate === 'function') {
    if (preload === 'note') {
      useUmami.track("feature", "前往编辑器");
      router.push('/note');
    } else if (preload === 'todo') {
      useUmami.track("feature", "前往待办");
      router.push('/todo');
    } else if (preload === 'ai') {
      useUmami.track("feature", "前往AI");
      router.push({
        path: '/home',
        query: {preload: extra}
      });
    } else if (preload === 'add') {
      useUmami.track("feature", "新增笔记");
      addSimpleNote(extra).then((a) => useHomeEditorStore().openArticle(a));
    }
  }
}

export const useMainPushCallback: MainPushCallback<any> = action => {
  if (action.code !== "function:search") {
    return [];
  }
  // 快速启动
  const storages = new Array<ArticleIndex>();
  for (let storage of useArticleStore().articles) {
    if (storage.name.indexOf(action.payload) > -1) {
      storages.push(storage);
    }
  }
  const items = storages.slice(0, Math.min(5, storages.length)).map(e => ({
    icon: 'public/logo.png',
    text: e.name,
    title: e.id + ''
  }))
  if (storages.length > 6) {
    items.push({
      icon: 'public/logo.png',
      text: `更多${storages.length - 5}条记录请前往插件内搜索`,
      title: ''
    })
  } else if (storages.length === 6) {
    items.push({
      icon: 'public/logo.png',
      text: storages[5]['name'],
      title: storages[5]['id'] + ''
    })
  }
  return items;
}

export const useMainPushSelectCallback: MainPushSelectCallback<any> = action => {
  keyword.value = `${action.payload}`;
  if (action.option.title) {
    toArticle(action.option.title);
  }
}