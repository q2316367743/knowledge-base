<template>
  <div class="encrypt-editor-init">
    <div class="encrypt-editor-init-content">
      <h3>加密文本初始化</h3>
      <div class="editor-type-selection">
        <div 
          v-for="option in editorOptions" 
          :key="option.value" 
          class="editor-type-box" 
          :class="{ 'active': type === option.value }"
          @click="type = option.value"
        >
          <div class="selection-dot"></div>
          <div class="editor-type-content">
            <span>{{ option.label }}</span>
          </div>
        </div>
      </div>
      <div class="submit-button">
        <t-button theme="primary" @click="onSubmit" :disabled="!type">确认</t-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['submit']);

const type = ref('');

const editorOptions = [
  { label: '纯文本编辑器', value: 'plaintext' },
  { label: 'Markdown编辑器', value: 'markdown' },
  { label: '富文本编辑器', value: 'rich-text' }
];

const onSubmit = () => {
  emit('submit', type.value);
}
</script>
<style scoped lang="less">
.encrypt-editor-init {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  background-color: var(--td-bg-color-container);
  
  .encrypt-editor-init-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 600px;
    width: 100%;
  }
  
  h3 {
    margin-bottom: 20px;
  }

  .editor-type-selection {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
    width: 100%;
  }

  .editor-type-box {
    position: relative;
    width: 120px;
    height: 120px;
    border: 2px solid var(--td-border-level-2-color);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--td-brand-color-hover);
    }

    &.active {
      border-color: var(--td-brand-color);
      background-color: rgba(0, 82, 217, 0.05);

      .selection-dot {
        background-color: var(--td-brand-color);
      }
    }

    .selection-dot {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 16px;
      height: 16px;
      border: 2px solid var(--td-border-level-2-color);
      border-radius: 50%;
      transition: all 0.3s;
    }

    .editor-type-content {
      text-align: center;
    }
  }

  .submit-button {
    margin-top: 10px;
  }
}
</style>
