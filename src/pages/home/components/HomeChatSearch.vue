<template>
  <t-dialog v-model:visible="visible" :header="false" :footer="false" placement="center">
    <t-input v-model="keyword" placeholder="搜索对话">
      <template #prefix-icon>
        <search-icon/>
      </template>
    </t-input>
    <t-list class="mt-16px" size="small" style="margin-top: 16px">
      <t-list-item v-for="{item} in results" :key="item.id">
        <div class="chat-item" :key="item.id" @click="onChatClick(item)">
          <div class="left">
            <chat-double-icon size="16px"/>
            <div class="title">{{ item.name }}</div>
          </div>
          <div class="right">
            {{ toDateTimeString(item.createBy) }}
          </div>
        </div>
      </t-list-item>
    </t-list>
  </t-dialog>
</template>
<script lang="ts" setup>
import {ChatDoubleIcon, SearchIcon} from "tdesign-icons-vue-next";
import {useAiChatListStore} from "@/store";
import {useFuse} from "@vueuse/integrations/useFuse";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {AiChatList} from "@/entity/ai/AiChat";
import {activeKey, collapsed} from "@/pages/home/model";

const visible = defineModel<boolean>({
  default: false
});
const items = computed(() => useAiChatListStore().lists);

const keyword = ref('');

const {results} = useFuse<AiChatList>(keyword, items, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: ['name']
  }
})
watch(visible, val => {
  if (val) {
    keyword.value = '';
  }
})

function onChatClick(data: AiChatList) {
  activeKey.value = `/home/chat/0/${data.id}`;
  visible.value = false;
  collapsed.value = true;
}
</script>
<style scoped lang="less">
.chat-item {
  padding: 12px 16px;
  width: 100%;
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }

  .left {
    display: flex;
    align-items: center;

    .title {
      font-weight: bold;
      margin-left: 8px;
    }
  }

}
</style>
