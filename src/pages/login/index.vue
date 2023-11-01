<template>
    <div class="container">
        <h1 style="text-align: center;margin-bottom: 24px">请选择存储位置</h1>
            <a-form-item label="token">
                <a-input-password v-model="key"/>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="login()">登录</a-button>
            </a-form-item>
    </div>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();

const key = ref('')

function login() {
    // 保存
}

</script>
<style lang="less">
</style>
