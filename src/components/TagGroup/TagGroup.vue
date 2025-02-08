<template>
  <a-space wrap>
    <a-tag
      v-for="tag in tags"
      :key="tag"
      closable
      @close="handleRemove(tag)"
      color="arcoblue"
    >
      {{ tag }}
    </a-tag>

    <a-input
      v-if="showInput"
      ref="inputRef"
      :style="{ width: '90px'}"
      size="mini"
      v-model.trim="inputVal"
      @keyup.enter="handleAdd"
      @blur="handleAdd"
    />
    <a-tag
      v-else
      :style="{
        width: '90px',
        backgroundColor: 'var(--color-fill-2)',
        border: '1px dashed var(--color-fill-3)',
        cursor: 'pointer',
      }"
      @click="handleEdit"
    >
      <template #icon>
        <icon-plus/>
      </template>
      新增标签
    </a-tag>
  </a-space>
</template>
<script lang="ts" setup>
import {Input as AInput, Space as ASpace, Tag as ATag} from "@arco-design/web-vue";
import {IconPlus} from '@arco-design/web-vue/es/icon';

const tags = defineModel({
  type: Array as PropType<string[]>,
  default: () => []
});

const inputRef = ref<InstanceType<typeof Input>>();
const showInput = ref(false);
const inputVal = ref('');

const handleEdit = () => {
  showInput.value = true;

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const handleAdd = () => {
  if (inputVal.value) {
    tags.value.push(inputVal.value);
    inputVal.value = '';
  }
  showInput.value = false;
};

const handleRemove = (key: string) => {
  tags.value = tags.value.filter((tag) => tag !== key);
};

</script>
<style scoped lang="less">
.tag-group {
  width: 100%;
  display: grid;
  gap: 8px;
}
</style>
