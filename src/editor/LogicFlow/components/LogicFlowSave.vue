<template>
  <div class="logic-flow-save">
    <t-space class="saved" size="small" v-if="saved">
      <check-circle-icon/>
      <span>已保存</span>
    </t-space>
    <t-space class="not-saved" size="small" v-else @click="handleSave">
      <info-circle-icon/>
      <span>未保存，点击保存</span>
    </t-space>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {CheckCircleIcon, InfoCircleIcon} from "tdesign-icons-vue-next";

export default defineComponent({
  name: 'LogicFlowSave',
  components: {InfoCircleIcon, CheckCircleIcon},
  props: {
    saved: Boolean
  },
  emits: ['save'],
  methods: {
    handleSave() {
      this.$emit('save');
    }
  }
});
</script>
<style scoped lang="less">
.logic-flow-save {
  padding: 4px 8px 2px;
  background-color: var(--td-bg-color-component);
  border: 1px solid var(--td-border-level-2-color);
  border-radius: var(--td-radius-default);
  box-shadow: var(--td-shadow-3);
  user-select: none;
  cursor: pointer;

  .saved {
    color: var(--td-success-color);
  }

  .not-saved {
    color: var(--td-error-color);
  }
}
</style>
