<template>
  <div class="kb-title-input__wrap">
    <t-input
      v-model="value"
      :placeholder="placeholder"
      :maxlength="100"
    >
      <template #suffix>
        <t-icon name="edit" class="t-icon"/>
      </template>
    </t-input>
  </div>
</template>
<script lang="ts" setup>
const value = defineModel<string>({
  type: String,
  default: ''
})
</script>
<script lang="ts">
export default defineComponent({
  name: 'KbInput',
  props: {
    placeholder: {
      type: String,
      default: '请输入'
    }
  }
})
</script>
<style scoped lang="less">

.kb-title-input__wrap {
  width: 100%;


  :deep(input) {
    font-weight: bold;
    font-size: var(--td-font-size-headline-medium);
  }

  :deep(.t-input) {
    background-color: transparent !important;
    border-color: transparent !important;
    height: 48px;

    &:hover {
      border-color: var(--td-border-level-2-color) !important;
    }
  }

}
</style>
