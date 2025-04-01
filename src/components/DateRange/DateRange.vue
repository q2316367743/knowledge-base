<template>
  <t-space class="date-range" size="small">
    <IconCalendar/>
    <span v-if="!hasDate">
      日期
      <del>与提醒</del>
    </span>
    <span v-else-if="hasSign">{{ props.start }}</span>
    <span v-else>{{ props.start }} - {{ props.end }}</span>
  </t-space>
</template>
<script lang="ts" setup>
import {IconCalendar} from '@arco-design/web-vue/es/icon';

const props = defineProps({
  start: String,
  end: String
});
const hasSign = computed(() => props.start === props.end);
const hasDate = computed(() => props.start && props.end);
</script>
<style scoped lang="less">

</style>
