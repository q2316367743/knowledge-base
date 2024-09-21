<template>
    <div class="logic-flow-save">
        <a-space class="saved" v-if="saved">
            <icon-check-circle />
            <span>已保存</span>
        </a-space>
        <a-space class="not-saved" v-else @click="handleSave">
            <icon-info-circle />
            <span>未保存，点击保存</span>
        </a-space>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'LogicFlowSave',
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
    background-color: var(--color-fill-2);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    user-select: none;
    cursor: pointer;
    .saved {
        color: rgb(var(--success-6))
    }
    .not-saved {
         color: rgb(var(--danger-6))
    }
}
</style>
