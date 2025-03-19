<template>
  <div class="setting-plugin-side">
    <a-tree block-node animation :data="pluginTree" :virtual-list-props="virtualListProps"
            @select="onSelect">
      <template #extra="nodeData">
        <a-dropdown v-if="nodeData.isLeaf">
          <t-button variant="text" theme="primary" shape="square">
            <template #icon>
              <ellipsis-icon/>
            </template>
          </t-button>
          <template #content>
            <a-doption @click="editPlugin(nodeData)">
              <template #icon>
                <edit2-icon/>
              </template>
              重命名
            </a-doption>
            <a-doption @click="removePlugin(nodeData.key)">
              <template #icon>
                <delete-icon/>
              </template>
              删除
            </a-doption>
          </template>
        </a-dropdown>
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
import {contains} from "@/utils/lang/ArrayUtil";
import {PLUGIN_FOLDER_KEYS, usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {createPlugin, editPlugin, removePlugin} from "@/pages/tool/plugin/components/operation";
import {DeleteIcon, Edit2Icon, EllipsisIcon, PlusIcon} from "tdesign-icons-vue-next";

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
