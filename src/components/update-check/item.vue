<template>
  <div v-if="log" class="log-item">
    <t-paragraph>
      <ol>
        <template v-for="item in log.items">
          <li v-if="typeof item === 'string'">{{ item }}</li>
          <ol v-else-if="item instanceof Array">
            <li v-for="i in item">
              <span v-html="i"></span>
            </li>
          </ol>
          <li v-else>
            <t-tag :color="renderTag(item.label).color" variant="light-outline" style="margin-left:5px;">
              {{ renderTag(item.label).name }}
            </t-tag>
            <span style="margin-left:5px;">{{ item.content }}</span>
          </li>
        </template>
      </ol>
    </t-paragraph>
    <t-alert v-if="log.remark">{{ log.remark }}</t-alert>
    <t-paragraph v-if="log.doc">
      更多详细的更新信息与功能变化，请在
      <t-link target="_blank" @click="open(log?.doc)">此处</t-link>
      中查看
    </t-paragraph>
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Log, LogItemEnum} from "@/components/update-check/domain";
import Constant from "@/global/Constant";

export default defineComponent({
  name: 'update-item',
  computed: {
    Constant() {
      return Constant
    }
  },
  props: {
    log: Object as PropType<Log>
  },
  methods: {
    renderTag(value: number): { name: string, color: string } {
      switch (value) {
        case LogItemEnum.ADD:
          return {
            name: '新增',
            color: 'blue'
          };
        case LogItemEnum.UPDATE:
          return {
            name: '更新',
            color: 'green'
          };
        case LogItemEnum.REPAIR:
          return {
            name: '修复',
            color: 'red'
          };
        case LogItemEnum.OPTIMIZATION:
          return {
            name: '优化',
            color: 'orange'
          };
        case LogItemEnum.MAJOR:
          return {
            name: '重要更新',
            color: '#f53f3f'
          }
        default:
          return {
            name: '',
            color: ''
          };
      }
    },
    open(url?: string) {
      if (url) {
        utools.shellOpenExternal(url);
      }
    }
  }
});
</script>
<style lang="less">
.log-item {
  .arco-alert-body {
    margin: 0;
  }

  li {
    margin: 4px 0;
  }
}
</style>
