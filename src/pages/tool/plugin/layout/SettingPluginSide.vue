<template>
  <div class="setting-plugin-side">
    <a-tree block-node animation :data="pluginTree" :virtual-list-props="virtualListProps"
            @select="onSelect">
      <template #extra="nodeData">
        <t-dropdown trigger="click" v-if="nodeData.isLeaf">
          <t-button variant="text" theme="primary" shape="square">
            <template #icon>
              <ellipsis-icon/>
            </template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item @click="editPlugin(nodeData)">
              <template #prefix-icon>
                <edit2-icon/>
              </template>
              重命名
            </t-dropdown-item>
            <t-dropdown-item @click="removePlugin(nodeData.key)">
              <template #prefix-icon>
                <delete-icon/>
              </template>
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
        <t-button variant="text" theme="primary" shape="square" v-else-if="nodeData.key !== 'share'"
                  @click="createPlugin(nodeData.key)">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
      </template>
    </a-tree>
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
const virtualListProps = computed(() => ({
  height: size.height.value - 14
}));

function onSelect(selectedKeys: Array<string | number>) {
  const selectKey = selectedKeys[0];
  if (contains(PLUGIN_FOLDER_KEYS, selectKey)) {
    emits('select');
  } else {
    // 文件
    emits('select', selectedKeys[0]);
  }
}

</script>
<style scoped>
.setting-plugin-side {
  padding: 7px;
}
</style>
