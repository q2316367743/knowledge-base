<template>
  <div class="setting-plugin-side">
    <t-tree :data="pluginTree" :activable="true" :line="true" :scroll="{type: 'virtual'}"
            :style="{height: virtualHeight}" @click="onSelect">
      <template #label="{node}">
        <div class="flex items-center">
          <component :is="node.data.icon"/>
          <div class="ml-8px">{{ node.label }}</div>
        </div>
      </template>
      <template #operations="{node}">
        <t-dropdown trigger="click" v-if="node.leaf">
          <t-button variant="text" theme="primary" shape="square">
            <template #icon>
              <ellipsis-icon/>
            </template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item @click="editPlugin(node.data)">
              <template #prefix-icon>
                <edit2-icon/>
              </template>
              重命名
            </t-dropdown-item>
            <t-dropdown-item @click="removePlugin(node.value)">
              <template #prefix-icon>
                <delete-icon/>
              </template>
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
        <t-button variant="text" theme="primary" shape="square" v-else-if="node.value !== 'share'"
                  @click="createPlugin(node.value)">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
      </template>
    </t-tree>
  </div>
</template>
<script lang="ts" setup>
import {DeleteIcon, Edit2Icon, EllipsisIcon, PlusIcon} from "tdesign-icons-vue-next";
import {contains} from "@/utils/lang/ArrayUtil";
import {PLUGIN_FOLDER_KEYS, usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {createPlugin, editPlugin, removePlugin} from "@/pages/tool/plugin/components/operation";

const emits = defineEmits(['select']);

const size = useWindowSize();

const pluginTree = computed(() => usePluginSettingStore().pluginTree);
const virtualHeight = computed(() => (size.height.value - 14) + 'px');

function onSelect(context: {node: any}) {
  const selectKey = context.node.value as string;
  if (contains(PLUGIN_FOLDER_KEYS, selectKey)) {
    emits('select');
  } else {
    // 文件
    emits('select', selectKey);
  }
}

</script>
<style scoped>
.setting-plugin-side {
  padding: 7px;
}
</style>
