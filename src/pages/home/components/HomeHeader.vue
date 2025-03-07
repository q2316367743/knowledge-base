<template>
  <div class="home-header flex justify-between">
    <home-assistant-select/>
    <t-space>
      <t-dropdown position="br" :options="options">
        <t-button variant="text" theme="primary" shape="square" class="home-header-setting">
          <template #icon>
            <setting-icon/>
          </template>
        </t-button>
      </t-dropdown>
    </t-space>
  </div>
</template>
<script lang="ts" setup>
import {SettingIcon} from "tdesign-icons-vue-next";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";

const router = useRouter();

const options = [{
  content: 'AI 服务',
  onClick: () => router.push("/setting/ai-service")
}, {
  content: 'AI 助手',
  onClick: () => router.push("/setting/ai-assistant")
}]

</script>
<style scoped lang="less">
.home-header {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
}
</style>
