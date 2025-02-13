<template>
  <a-tooltip content="AI助理" position="bottom" v-if="useChatSettingStore().enable">
    <a-button @click="switchRobot()" type="text">
      <template #icon>
        <icon-robot/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script lang="ts" setup>
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {useHomeEditorStore, useUpdateRobotEvent} from "@/store/components/HomeEditorStore";

const switchRobot = () =>  useUpdateRobotEvent.emit(useHomeEditorStore().id);
</script>
<style scoped lang="less">

</style>
