<template>
  <div class="customer-bg">
    <img v-if="imgSrc" :src="imgSrc" alt="背景图片" class="customer-img"/>
  </div>
</template>
<script lang="ts" setup>
import {useGlobalStore, useThemeSettingStore} from "@/store";

const imgSrc = computed(() => {
  const {theme} = useThemeSettingStore();
  if (!theme.enabled) return '';
  const {isDark} = useGlobalStore();
  return isDark ? theme.darkBgImage : theme.lightBgImage;
});
const bgBlur = computed(() => {
  const {theme} = useThemeSettingStore();
  if (!theme.enabled) return '';
  return `blur(${theme.bgBlur}px)`;
});

</script>
<style scoped lang="less">
.customer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  background-color: var(--td-bg-color-container);

  .customer-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: v-bind(bgBlur);
    transform: scale(1.1);
    object-fit: cover;
  }


  .customer-img-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
