<template>
  <div class="more-setting-theme">
    <t-form :model="{}">
      <t-form-item label="主题颜色" label-align="top">
        <t-radio-group v-model="themeColor" :options="ThemeColors"/>
      </t-form-item>
    </t-form>
  </div>
</template>
<script lang="ts" setup>
import {ThemeColors} from "@/global/theme";
import {useGlobalStore} from "@/store";

const {themeColor} = toRefs(useGlobalStore());
</script>
<style scoped>
</style>
