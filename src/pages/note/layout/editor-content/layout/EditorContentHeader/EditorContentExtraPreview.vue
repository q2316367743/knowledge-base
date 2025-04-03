<template>
  <t-tooltip :content="'切换为' + (preview ? '编辑' : '预览')" placement="bottom">
    <t-button variant="text" theme="primary" shape="square" @click="switchPreview()"
              :disabled="editorType === ArticleTypeEnum.EXCEL">
      <template #icon>
        <edit2-icon v-if="preview"/>
        <lock-on-icon v-else/>
      </template>
    </t-button>
  </t-tooltip>
</template>
<script lang="ts" setup>
import {editorType, homeEditorId, preview, useArticlePreviewEvent} from "@/store";
import {Edit2Icon, LockOnIcon} from "tdesign-icons-vue-next";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";

const switchPreview = (id?: number) => useArticlePreviewEvent.emit(id || homeEditorId.value);
</script>
<style scoped lang="less">

</style>
