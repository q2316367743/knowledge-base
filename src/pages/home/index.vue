<template>
    <div class="home">
        <a-row :gutter="7">
            <a-col :span="12">
                <a-card title="快捷工具">
                    <a-button type="primary" @click="toEditor()">
                        新增文章
                    </a-button>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts" setup>

import {useRouter} from "vue-router";

const router = useRouter();
function toEditor() {
    router.push("/editor/0")
}

</script>
<style scoped>
.home {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    border: 7px;
}
</style>
