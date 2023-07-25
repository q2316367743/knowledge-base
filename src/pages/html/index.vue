<template>
    <div class="offline-html">
        <div class="header">
            <a-input v-model="keyword" placeholder="请输入标题" allow-clear style="width: 350px"/>
            <a-button-group type="primary">
                <a-button @click="add()" style="margin-right: 7px;">
                    <template #icon>
                        <icon-plus />
                    </template>
                </a-button>
                <a-button>
                    <template #icon>
                        <icon-settings />
                    </template>
                </a-button>
            </a-button-group>
        </div>
        <div class="container"></div>
    </div>
</template>
<script lang="ts" setup>
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {ref} from "vue";

const keyword = ref('');

function add() {
    MessageBoxUtil.prompt("请输入网址链接", "新增离线网页", {
        confirmButtonText: "新增",
        cancelButtonText: "取消"
    })
}

</script>
<style scoped lang="less">
.offline-html {
    position: absolute;
    top: 4px;
    left: 7px;
    right: 7px;
    bottom: 4px;
    .header {
        display: flex;
        justify-content: space-between;
    }
}
</style>
