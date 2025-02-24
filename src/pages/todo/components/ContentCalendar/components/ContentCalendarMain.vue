<template>
  <div class="content-calendar-main">
    <div class="calendar">
      <calendar expanded :is-dark="isDark" :attributes="attributes" title-position="left" @dayclick="onDayClick"
                transparent/>
      <div class="article" v-if="!hideOfArticle">
        <div class="title">关联文章</div>
        <div class="list">
          <a-list :bordered="false">
            <a-list-item v-for="article in articleList">
              <a-link @click="toArticleByTodo(article.id)">{{ article.name }}</a-link>
            </a-list-item>
          </a-list>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">
        {{ title }}
      </div>
      <div class="list">
        <card-todo-item v-for="index in indexes" :item="index" @update="onUpdate" :key="index.id" attr only/>
      </div>
    </div>
    <div class="add">
      <a-button type="primary" @click="openAddTodoItem()" shape="circle" size="large">
        <template #icon>
          <icon-plus/>
        </template>
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {Calendar} from 'v-calendar';
import {ArticleIndex} from "@/entity/article";
import {handleSimplePriorityColor, TodoItemIndex, TodoItemStatus} from "@/entity/todo/TodoItem";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";
import {map} from "@/utils/lang/ArrayUtil";
import {sortTodoIndex} from "@/utils/component/TodoUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useTodoArticleStore} from "@/store/db/TodoArticleStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";

interface Attribute {
  key: string | number;
  highlight?: string;
  dates: Date | Array<Date | Array<Date>>;
  dot?: boolean | string;
}

const attributes = ref<Array<any>>([]);
const indexes = ref<Array<TodoItemIndex>>([]);
const title = ref("请选择日期");

const articleList = computed<Array<ArticleIndex>>(() => {
  const {items} = useTodoArticleStore();
  const {articleMap} = useArticleStore();
  const list = new Array<ArticleIndex>();
  for (const item of items) {
    const one = articleMap.get(item);
    if (one) {
      list.push(one);
    }
  }
  return list;
});

const items = computed<Array<TodoItemIndex>>(() => {
  const {todoGroupView} = useTodoWrapStore();
  console.log(todoGroupView)
  return todoGroupView.flatMap(e => ([...e.children.flatMap(e => e.children), ...e.complete]));
})
const isDark = computed(() => useGlobalStore().isDark);
const todoMap = computed(() => map(items.value, 'id'));
const hideOfArticle = computed(() => useTodoWrapStore().hideOfArticle);
const hideOfCompleteOrAbandon = computed(() => useTodoWrapStore().hideOfCompleteOrAbandon);

watch(items, value => buildAttributes(value).then(res => attributes.value = res), {
  deep: true,
  immediate: true
});
watch(hideOfCompleteOrAbandon, () => {
  buildAttributes(items.value).then(res => attributes.value = res)
})

async function buildAttributes(indexes: Array<TodoItemIndex>): Promise<Array<Attribute>> {
  const attrs = await useTodoItemStore().getMultiTodoItemAttr(indexes.map(index => index.id));
  const attrMap = map(attrs, 'id');

  return Promise.resolve(indexes.map(index => {
    const attr = attrMap.get(LocalNameEnum.TODO_ATTR + index.id);

    let dot: boolean | undefined = true;
    let dates: Date | Date[][] = new Date(index.id);

    if (attr) {
      if (attr.record.start !== attr.record.end) {
        dot = undefined;
        dates = [[new Date(attr.record.start), new Date(attr.record.end)]];
      } else if (attr.record.start) {
        dates = new Date(attr.record.start)
      }
    }

    const color = handleSimplePriorityColor(index.priority);

    return {
      key: index.id,
      highlight: dot ? undefined : color,
      dates: dates,
      dot: dot ? color : undefined,
    }
  }));
}

function onDayClick(a: any) {
  indexes.value = [];
  const attributes = a.attributes as Array<Attribute>;
  const temp = new Array<TodoItemIndex>();
  for (let attribute of attributes) {
    const todoItemIndex = todoMap.value.get(attribute.key as number);
    if (todoItemIndex) {
      temp.push(todoItemIndex);
    }
  }
  indexes.value = temp.sort((a, b) => sortTodoIndex(a, b, useTodoWrapStore().sort))
    .filter(e => {
      if (hideOfCompleteOrAbandon.value) {
        if (e.status === TodoItemStatus.COMPLETE || e.status === TodoItemStatus.ABANDON) {
          return false;
        }
      }
      return true;
    });
  title.value = a.id;
}

function onUpdate() {
  const temp = new Array<TodoItemIndex>();
  for (let valueElement of indexes.value) {
    const todoItemIndex = todoMap.value.get(valueElement.id);
    if (todoItemIndex) {
      temp.push(todoItemIndex);
    }
  }
  indexes.value = temp.sort((a, b) => sortTodoIndex(a, b, useTodoWrapStore().sort))
    .filter(e => {
      if (hideOfCompleteOrAbandon.value) {
        if (e.status === TodoItemStatus.COMPLETE || e.status === TodoItemStatus.ABANDON) {
          return false;
        }
      }
      return true;
    });
}

</script>
<style scoped>

</style>
