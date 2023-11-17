<template>
    <icon-storage v-if="props.type === EditorDriverTypeEnum.LOCAL"/>
    <img src="@/assets/icon/gitee_white.svg" alt="gitee" width="14"
         v-else-if="props.type === EditorDriverTypeEnum.GITEE && props.icon"/>
    <img src="@/assets/icon/gitee_red.svg" alt="gitee" width="14"
         v-else-if="props.type === EditorDriverTypeEnum.GITEE && !props.icon"/>
    <icon-github v-else-if="props.type === EditorDriverTypeEnum.GITHUB"/>
    <icon-home v-else/>
</template>
<script lang="ts" setup>
import EditorDriverTypeEnum from "@/enumeration/EditorDriverTypeEnum";

const props = defineProps({
    type: Number,
    icon: Boolean
});
</script>
<style scoped>

</style>
