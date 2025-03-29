<template>
  <t-paragraph class="he-toc">
    <t-descriptions :column="1" layout="vertical" item-layout="horizontal">
      <t-description-item label="创建时间">
        {{ createTime }}
      </t-description-item>
      <t-description-item label="更新时间">
        {{ updateTime }}
      </t-description-item>
      <t-description-item label="字符数" v-if="length > -1">
        {{ length }}
      </t-description-item>
      <t-description-item label="行数" v-if="lines > -1">
        {{ lines }}
      </t-description-item>
    </t-descriptions>
    <div v-for="item in toc" :key="item.id">
      <t-link :style="{marginLeft: (item.level * 15) + 'px'}" v-html="item.text" @click.stop="toToc(item.id)"/>
    </div>
  </t-paragraph>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {getLineLength, getTextCount, getToc} from "@/store/components/HomeEditorStore";

const emits = defineEmits(['hide']);

function toToc(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView();
  }
  emits('hide');
}

const createTime = computed(() => '');
const updateTime = computed(() => '');

const length = getTextCount.value();
const lines = getLineLength.value();
const toc = getToc.value();

</script>
<style scoped>
.he-toc {
  width: 250px;
  max-height: 70vh;
  overflow: auto;
  background-color: var(--color-neutral-3);
  color: var(--td-text-color-primary);
  padding: 21px 14px 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>
