<template>
  <div class="setting-ai-service">
    <t-alert>
      <span>推荐使用</span>
      <t-link @click="toApi()" theme="primary" hover="underline" class="ml-4px">V3 API</t-link>
      <span>，无需科学上网，即可使用。</span>
      <template #close>
        <t-button theme="primary" size="small" @click.stop="openAddServiceDrawer()">新增</t-button>
      </template>
    </t-alert>
    <div class="mt-8px">
      <t-list :split="true">
        <t-list-item v-for="s in aiServices" :key="s.id">
          <t-list-item-meta :title="s.name">
            <template #description>
              <t-space size="small">
                <t-tag theme="success">{{ s.type }}</t-tag>
                <t-tag theme="primary">{{ s.models.length }}个模型</t-tag>
              </t-space>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-button v-if="s.type === AiServiceType.U_TOOLS" theme="primary" @click="showUtoolsModel">查看</t-button>
            <t-space v-else size="small">
              <t-button theme="primary" @click="openAddServiceDrawer(s)">编辑</t-button>
              <t-popconfirm content="是否立即删除此服务，删除后无法恢复" @confirm="handleRemove(s.id)">
                <t-button theme="danger">删除</t-button>
              </t-popconfirm>
            </t-space>
          </template>
        </t-list-item>
      </t-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useAiServiceStore} from "@/store";
import {openAddServiceDrawer} from "@/pages/setting/ai-service/dialog/AddServiceDrawer";
import MessageUtil from "@/utils/modal/MessageUtil";
import {AiServiceType} from "@/entity/ai/AiService";
import {showUtoolsModel} from "@/pages/setting/ai-service/dialog/ShowUtoolsModel";

const aiServices = computed(() => useAiServiceStore().aiServices);

const toApi = () =>
  InjectionUtil.shellOpenExternal("https://api.v3.cm/register?aff=6A4f");

const handleRemove = (id: string) => {
  useAiServiceStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e));
}
</script>
<style scoped lang="less">
.setting-ai-service {
  position: relative;
  height: 100%;
}
</style>
