<template>
  <t-dropdown trigger="click" position="br">
    <t-button variant="text" theme="primary" shape="square">
      <template #icon>
        <more-icon/>
      </template>
    </t-button>
    <t-dropdown-menu>
      <t-dropdown-item :disabled="disabled" @click="openTodoExport()">
        <template #prefix-icon>
          <icon-export/>
        </template>
        导出
      </t-dropdown-item>
      <t-dropdown-item :disabled="disabled" @click="openAddRelationArticle()">
        <template #prefix-icon>
          <icon-relation/>
        </template>
        关联笔记
      </t-dropdown-item>
      <t-dropdown-item :disabled="disabled" @click="searchTodo()">
        <template #prefix-icon>
          <icon-search/>
        </template>
        搜索
      </t-dropdown-item>
      <t-dropdown-item :disabled="disabled" @click="openTodoSetting()" :divider="true">
        <template #prefix-icon>
          <icon-settings/>
        </template>
        设置
      </t-dropdown-item>
      <t-dropdown-item :disabled="disabled" @click="openEditTodoGroupFunc()">
        <template #prefix-icon>
          <icon-plus/>
        </template>
        添加分组
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>
<script lang="ts" setup>
import {MoreIcon} from "tdesign-icons-vue-next";
import {openTodoExport} from "@/pages/todo/common/TodoExport";
import {openAddRelationArticle} from "@/pages/todo/common/AddRelationArticle";
import {searchTodo} from "@/pages/todo/common/SearchTodo";
import {openTodoSetting} from "@/pages/todo/common/TodoSetting";
import {openEditTodoGroupFunc} from "@/pages/todo/common/TodoGroupFunc";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

const disabled = computed(() => useTodoWrapStore().categoryId === 0);
</script>
<style scoped lang="less">

</style>
