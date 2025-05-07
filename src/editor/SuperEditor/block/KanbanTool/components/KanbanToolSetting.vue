<template>
  <div class="kanban-tool-setting">
    <t-popup placement="bottom" trigger="click">
      <t-button theme="primary" variant="text" shape="square" size="small">
        <template #icon>
          <setting-icon/>
        </template>
      </t-button>
      <template #content>
        <div class="kanban-tool-setting-content">
          <div class="flex justify-between">
            <div>显示备注</div>
            <t-switch :default-value="showRemark" @change="onChange"/>
          </div>
        </div>
      </template>
    </t-popup>
  </div>
</template>
<script lang="ts" setup>
import {SettingIcon} from "tdesign-icons-vue-next";
import {IKanbanInstance, KanbanInstance} from "@/editor/SuperEditor/block/KanbanTool/types";

const instance = inject<IKanbanInstance>(KanbanInstance);

const showRemark = computed(() => instance?.data.value.showRemark);

function onChange(value: any) {
  instance?.changeShowRemark(value);
}
</script>
<style scoped lang="less">
.kanban-tool-setting-content {
  width: 180px;
  padding: 8px;
}
</style>
