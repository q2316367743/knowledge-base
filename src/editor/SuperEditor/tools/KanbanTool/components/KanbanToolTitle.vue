<template>
  <div class="kanban-tool-title">
    <t-input v-if="edit" v-model="title" size="small" :clearable="true" :autofocus="true"
             @enter="onEnter" @blur="onEnter"/>
    <span v-else class="kanban-tool-title-text" @dblclick="onDblclick">{{ title }}</span>
  </div>
</template>
<script lang="ts" setup>
const title = defineModel({
  type: String,
  default: ''
});

const edit = ref(false);

function onDblclick() {
  edit.value = true;
}

function onEnter() {
  edit.value = false;
}
</script>
<style scoped lang="less">
.kanban-tool-title {
  .kanban-tool-title-text {
    user-select: none;
  }
}
</style>
