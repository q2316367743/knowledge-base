<template>
  <div class="user-view">
    <div class="nickname">{{ user.nickname }}</div>
    <t-tag class="role" theme="danger" variant="outline" v-if="user.role === 1 || user.role === 3">管理员</t-tag>
    <t-tag class="role" theme="primary" variant="outline" v-else-if="user.role === 2">开发人员</t-tag>
  </div>
</template>

<script lang="ts" setup>
import {UserView} from "@/nested/feedback/apis/types";

defineProps({
  user: {
    type: Object as PropType<UserView>,
    default: () => ({})
  },
});
</script>

<style scoped lang="less">
.user-view {
  display: flex;
  align-items: center;
  .nickname {
    margin-right: 8px;
  }
}
</style>
