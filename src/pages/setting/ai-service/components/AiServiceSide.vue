<template>
  <t-layout class="h-full" style="background-color: var(--td-bg-color-container);">
    <t-content style="overflow: auto;" @click="close">
      <div class="ai-service-item w-full flex justify-between items-center ml-3px mb-4px" v-for="s in aiServices"
           :key="s.id" :class="{checked:s.id===currentId}" @click.stop="currentId = s.id">
        <div class="ellipsis">{{ s.name }}</div>
        <t-tag v-if="s.type === AiServiceType.U_TOOLS" theme="success" size="small" variant="outline">uTools</t-tag>
        <t-popconfirm content="确认删除此AI服务" @confirm="handleRemove(s.id)" v-else>
          <t-button theme="danger" variant="text" shape="square" size="small" @click.stop>
            <template #icon>
              <delete-icon />
            </template>
          </t-button>
        </t-popconfirm>
      </div>
    </t-content>
    <t-footer style="padding: 8px;">
      <t-button theme="primary" variant="outline" :block="true" @click="handleAdd" :disabled="currentId === '0'">新增
      </t-button>
    </t-footer>
  </t-layout>
</template>
<script lang="ts" setup>
import {DeleteIcon} from "tdesign-icons-vue-next";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {AiServiceType} from "@/entity/ai/AiService";

const currentId = defineModel({
  type: String,
  default: ''
});

const aiServices = computed(() => useAiServiceStore().aiServices);

onMounted(() => {
  if (aiServices.value.length > 0) {
    currentId.value = aiServices.value[0].id;
  }
})

const handleAdd = () => currentId.value = '0'
const close = () => currentId.value = '';

function handleRemove(id: string) {
  useAiServiceStore().remove(id)
    .then(() => {
      MessageUtil.success("删除成功");
      if (id === currentId.value) {
        close();
      }
    })
    .catch(e => MessageUtil.error("删除失败", e));
}

</script>
<style scoped lang="less">
.ai-service-item {
  padding: 4px 8px;
  margin-top: 4px;
  border: 1px solid var(--td-border-level-2-color);
  border-radius: var(--td-radius-medium);
  transition: all 0.3s;
  width: calc(100% - 24px);

  &:hover {
    background-color: var(--td-bg-color-component-hover);
  }

  &.checked {
    background-color: var(--td-bg-color-component-hover);
    border: 1px solid var(--td-border-level-1-color);
    color: var(--td-brand-color);
  }
}
</style>
