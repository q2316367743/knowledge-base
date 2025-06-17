<template>
  <t-space wrap size="small">
    <t-tag
      v-for="tag in tags"
      @close="handleRemove(tag)"
      theme="primary"
      :closable="true"
    >
      {{ tag }}
    </t-tag>

    <template v-if="!readonly" >
      <t-input
        v-if="showInput"
        :autofocus="true"
        :style="{ width: '90px'}"
        size="small"
        v-model.trim="inputVal"
        @enter="handleAdd"
        @blur="handleAdd"
      />
      <t-tag
        v-else
        :style="{
        width: '90px',
        cursor: 'pointer',
      }"
        @click="handleEdit"
      >
        <template #icon>
          <plus-icon/>
        </template>
        新增标签
      </t-tag>
    </template>
  </t-space>
</template>
<script lang="ts" setup>
import {PlusIcon} from "tdesign-icons-vue-next";

const tags = defineModel({
  type: Array as PropType<string[]>,
  default: () => []
});
defineProps({
  readonly: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['change']);

const showInput = ref(false);
const inputVal = ref('');

const handleEdit = () => {
  showInput.value = true;
};

const handleAdd = () => {
  if (inputVal.value) {
    tags.value.push(inputVal.value);
    inputVal.value = '';
    emit('change', tags.value);
  }
  showInput.value = false;
};

const handleRemove = (key: string) => {
  tags.value = tags.value.filter((tag) => tag !== key);
  emit('change', tags.value);
};

</script>
<style scoped lang="less">
.tag-group {
  width: 100%;
  display: grid;
  gap: 8px;
}
</style>
