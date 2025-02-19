<template>
  <a-layout class="h-full">
    <a-layout-content style="overflow: auto" @click="close">
      <a-radio-group v-model="currentId" direction="vertical" class="w-full">
        <a-radio v-for="s in aiServices" :key="s.id" :value="s.id">
          <template #radio="{ checked }">
            <div class="ai-service-item w-full flex justify-between items-center" :class="{checked}">
              <div class="ellipsis">{{ s.name }}</div>
              <a-popconfirm content="确认删除此AI服务" @ok="handleRemove(s.id)">
                <a-button type="text" size="mini" status="danger" @click.stop>
                  <template #icon>
                    <icon-delete/>
                  </template>
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-radio>
      </a-radio-group>
    </a-layout-content>
    <a-layout-footer style="padding: 8px;">
      <a-button type="outline" long @click="handleAdd" :disabled="currentId === '0'">新增</a-button>
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import MessageUtil from "@/utils/modal/MessageUtil";

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
  border: 1px solid var(--color-border-1);
  border-radius: var(--border-radius-medium);
  transition: background-color, color 0.3s;

  &.checked {
    background-color: var(--color-fill-1);
    color: rgb(var(--primary-6));
  }
}
</style>
