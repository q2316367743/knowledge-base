<template>
  <a-split class="home-editor" v-model:size="size" :min="min" :max="max" :disabled="disabled">
    <template #first>
      <editor-side/>
    </template>
    <template #second>
      <editor-content/>
    </template>
  </a-split>
</template>
<script lang="ts" setup>
import {useSearchContentEvent} from "@/global/BeanFactory";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";
import {openSearchContent} from "@/pages/home/components/SearchContent";
import EditorSide from '@/pages/home/layout/editor-side/index.vue';
import EditorContent from "@/pages/home/layout/editor-content/index.vue";

const windowSize = useWindowSize();

const size = ref(useHomeEditorStore().width);
const min = computed(() => useHomeEditorStore().collapsed ? "0px" : "270px");
const max = computed(() => (windowSize.width.value - 350) + 'px');
const disabled = computed(() => size.value === '0px');

watch(() => size.value, value => useHomeEditorStore().setWidth(value));
watch(() => useHomeEditorStore().width, value => {
  if (value !== size.value) {
    size.value = value;
  }
});

onMounted(() => {
  useSearchContentEvent.off(openSearchContent);
  useSearchContentEvent.on(openSearchContent);
});

onUnmounted(() => {
  useSearchContentEvent.off(openSearchContent);
});

useCustomerFileNameStore().init();

</script>
<style lang="less">
.home-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .arco-split-pane {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
