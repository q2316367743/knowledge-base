<template>
  <div class="todo-info">
    <header class="header">
      <div class="close">
        <t-button theme="danger" shape="square" @click="handleClose">
          <template #icon>
            <close-icon/>
          </template>
        </t-button>
      </div>
      <t-popup placement='bottom' trigger="click" show-arrow>
        <div class="date">
          <t-button>
            <DateRange :start="range[0]" :end="range[1]"/>
          </t-button>
        </div>
        <template #content>
          <div class='todo-item-setting__date'>
            <div>
              <t-radioGroup v-model="isRange" variant="default-filled">
                <t-radio-button :value="false">时间</t-radio-button>
                <t-radio-button :value="true">时间段</t-radio-button>
              </t-radioGroup>
            </div>
            <div style="margin-top: 8px;">
              <t-date-range-picker v-if="isRange" v-model="range" clearable @change="updateSelf"/>
              <t-date-picker v-else v-model="range[0]" clearable @change="updateSelf"/>
            </div>
          </div>
        </template>
      </t-popup>
      <!-- 优先级 -->
      <div class="priority">
        <priority-dropdown v-model="item.index.priority" variant="outline" @change="updateSelf()"/>
      </div>
    </header>
    <!-- 标题 -->
    <div class="title">
      <kb-title-input v-model="item.index.title" placeholder="待办标题，回车修改" @change="updateSelf()"/>
    </div>
    <div class="content">
      <rich-text-editor v-model="item.content.record.content" simple @change="updateContent()" v-if="isInit"
                        :auto-focus="false"/>
    </div>
    <footer class="footer overflow-y-hidden">
      <tag-group v-model="item.attr.tags" @change="updateSelf()"/>
      <main-content-attr/>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import {getDefaultTodoItem, TodoItem, TodoItemAttr} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import MainContentAttr
  from "@/pages/todo/common/TodoInfo/components/MainContentAttr.vue";
import {CloseIcon} from "tdesign-icons-vue-next";

function renderIsRange(attr: TodoItemAttr): boolean {
  if (attr.start === '' && attr.end === '') {
    return false;
  }
  return attr.start !== attr.end;

}

const item = ref<TodoItem>(getDefaultTodoItem());
const isInit = ref(false);
const isRange = ref(true);
const range = ref<Array<string>>([]);

onMounted(async () => {
  item.value = await useTodoItemStore().getTodoItem(useTodoWrapStore().itemId);
  isInit.value = true;

  isRange.value = renderIsRange(item.value.attr);
  range.value = [item.value.attr.start, item.value.attr.end];
});


// 更新标题
function updateSelf() {
  // 更新标题
  useTodoItemStore().updateById(
    useTodoWrapStore().itemId,
    {
      title: item.value.index.title,
      priority: item.value.index.priority
    },
    {
      tags: item.value.attr.tags
    }
  )
}

// 更新内容
async function updateContent() {
  if (!isInit.value) return;
  // 更新内容
  item.value.content.rev = await useTodoItemStore().saveContent(
    useTodoWrapStore().itemId,
    item.value.content.record, item.value.content.rev)
}

function handleClose() {
  useTodoWrapStore().setItemId(0);
}
</script>
<style scoped lang="less">
.todo-info {
  position: relative;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  padding: 8px;
  overflow: hidden;
  border-left: 1px solid var(--td-border-level-2-color);

  .header {
    display: flex;
    gap: 8px;

    .priority {
      margin-left: auto;
    }
  }

  .title {
    margin-top: 8px;
  }

  .content {
    position: relative;
    height: 70vh;
    margin-top: 8px;
    border-radius: var(--td-radius-default);
    overflow: hidden;
    border: 1px solid var(--td-border-level-2-color);
  }

  .footer {
    position: absolute;
    left: 7px;
    right: 7px;
    bottom: 7px;
    display: flex;
    justify-content: space-between;
    overflow-x: auto;
    height: 24px;
  }
}
</style>
