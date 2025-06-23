<template>
  <div class="kb-input__wrap">
    <div class="kb-input">
      <input class="kb-input__inner" :placeholder type="text" unselectable="off" spellcheck="false" v-model="value">
    </div>
    <div class="kb-input__suffix" v-if="$slots['suffix']">
      <slot name="suffix"/>
    </div>
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

.kb-input__wrap {
  width: 100%;

  .kb-input {
    margin: 0;
    list-style: none;
    position: relative;
    height: var(--td-comp-size-m);
    border-radius: var(--td-radius-default);
    padding: 0 var(--td-comp-paddingLR-s);
    background-color: var(--td-bg-color-specialcomponent);
    outline: none;
    color: var(--td-text-color-primary);
    font: var(--td-font-body-medium);
    width: 100%;
    box-sizing: border-box;
    transition: border cubic-bezier(.38, 0, .24, 1) .2s, box-shadow cubic-bezier(.38, 0, .24, 1) .2s, background-color cubic-bezier(.38, 0, .24, 1) .2s;
    display: flex;
    align-items: center;
    overflow: hidden;

    .kb-input__inner {
      flex: 1;
      border: none;
      outline: none;
      padding: 0;
      max-width: 100%;
      min-width: 0;
      color: var(--td-text-color-primary);
      font: inherit;
      background-color: transparent;
      box-sizing: border-box;
      white-space: nowrap;
      word-wrap: normal;
    }
  }


  .kb-input:focus {
    z-index: 1;
    box-shadow: 0 0 0 2px var(--td-brand-color-focus)
  }


  .kb-input :focus-visible {
    outline: none
  }

  .kb-input__suffix > .t-icon {
    color: var(--td-text-color-placeholder);
    transition: all .2s linear
  }

  .kb-input__suffix > .t-icon:hover {
    color: var(--td-text-color-secondary);
    transition: all .2s linear
  }

  .kb-input__suffix:not(:empty) {
    margin-left: var(--td-comp-margin-s)
  }
}
</style>
