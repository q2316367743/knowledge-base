<template>
    <a-modal v-model:visible="visible" title="版本更新" mask-closable draggable lock-scroll
             width="600px">
        <a-alert style="margin-bottom: 7px">
            更加详细的更新说明，可以关注
            <a-link @click="toBlog()">作者博客</a-link>
        </a-alert>
        <div class="entry">
            <div>
                <span>恭喜你成功更新到 </span>
                <span style="color: rgb(var(--arcoblue-6))">{{ version }}</span>
            </div>
            <div>本次更新如下：</div>
            <update-item :log="log"/>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog";
import {ref} from "vue";
import Constant from "@/global/Constant";
import updateCheck from "@/components/update-check/UpdateCheck";

const log = UpdateLog[0];
const version = Constant.version;
const visible = ref(false);

updateCheck(() => visible.value = true);

const toBlog = () => utools.shellOpenExternal(Constant.website)

</script>
<style scoped>

</style>
