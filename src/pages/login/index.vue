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
import {initData} from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";

const router = useRouter();

const key = ref('')

function login() {
    // 保存
    localStorage.setItem("token", key.value);
    initData()
        .then(() => router.push("/home"))
        .catch(e => MessageUtil.error("初始化数据失敗", e));
}

</script>
<style lang="less">
</style>
